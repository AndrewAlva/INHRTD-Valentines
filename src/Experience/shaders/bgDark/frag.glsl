#define PI_2 6.2831853072

uniform vec2 uScreen;
uniform vec3 uColorInside;
uniform vec3 uColorOutside;
uniform sampler2D uMap;
uniform sampler2D uDisplacementMap;
uniform sampler2D uMask;
uniform float uTransition;
uniform float uTime;

varying vec2 vUv;

vec2 rotateUV(vec2 uv, float r, vec2 origin) {
    float c = cos(r);
    float s = sin(r);
    mat2 m = mat2(c, -s,
                  s, c);
    vec2 st = uv - origin;
    st = m * st;
    return st + origin;
}

vec2 scaleUV(vec2 uv, vec2 scale, vec2 origin) {
    vec2 st = uv - origin;
    st /= scale;
    return st + origin;
}

float msdf(sampler2D tMap, vec2 uv) {
    vec3 tex = texture2D(tMap, uv).rgb;
	  // If you have small artifacts, try to tweak the 0.5 value.
    float signedDist = max(min(tex.r, tex.g), min(max(tex.r, tex.g), tex.b)) - 0.5;
    float d = fwidth(signedDist);
    float alpha = smoothstep(-d, d, signedDist);
    return alpha;
}

void main()
{
    vec2 screenUV = gl_FragCoord.xy / uScreen;

    // "Light" Radial gradient bg
    vec2 bgUV = rotateUV(vUv, -0.5, vec2(0.5));
    bgUV = bgUV * vec2(1., 1.3);
    float start = 0.01;
    float fade = 0.12;
    float textFade = 0.22;

    float circle = length(bgUV - vec2(0.485, 0.725));
    float lerp = smoothstep(start, start + fade, circle);
    vec3 gradient = mix(uColorInside, uColorOutside, lerp);


    // Base text texture (Mine for eternity)
    vec3 textColor = vec3(1., 0.1647, 0.345);
    float lerpTextColor = smoothstep(start, start + textFade, circle);
    textColor = mix(textColor, uColorOutside, lerpTextColor);


    // Text UVs (including distortion)
    // vec2 tileUV = abs(vUv - vec2(1., 0.));
    vec2 textUV = screenUV;


    // Perlin Noise calc
    float displacement = texture2D(uDisplacementMap, screenUV).r;
    displacement = 1. - displacement;
    float strength = pow(displacement, 0.8) * 1.125;


    // Waves
    float waves = screenUV.y - (cos(screenUV.x * PI_2 * 2.) * 0.175);
    waves *= strength * 0.5;
    textUV.y += waves;


    // Radial Circle
    float radialCircle = 1. - ( (1. - length(screenUV - 0.5)) - 0.75 );
    radialCircle += strength * 0.5;
    textUV = scaleUV(textUV, vec2(radialCircle), vec2(0.5));


    // Perlin noise push
    textUV.x -= (strength) * 0.175;


    // Falling motion
    textUV.y += (uTime) * 0.09;


    // Repeat texture (tiling)
    textUV = fract((textUV * 4.) - 0.5);


    ////// Final composite
    // Masks
    float maskTexel = texture2D(uMask, (screenUV + 0.5) * 0.5).r;
    float t = 1.005 - uTransition;
    // float mask = smoothstep(t - (0.2 * uTransition), t, maskTexel);
    float mask = step(t, maskTexel);

    float text = msdf(uMap, textUV * mask);
    vec3 color = mix(gradient, textColor, text);

    // alpha
    // float alpha = uTransition * mask;
    float alpha = mask;


    // vec3 tileColor = vec3(tileUV, 1.);
    // color += strength;
    gl_FragColor = vec4(color, alpha);
    // gl_FragColor = vec4(textUV, 1., 1.);
    // gl_FragColor = vec4(vec3(radialCircle), 1.);
    // gl_FragColor = vec4(vec3(strength), 1.);
    // gl_FragColor = vec4(vec3(displacement), 1.);
    // gl_FragColor = vec4( msdf(uMap, screenUV) );
    // gl_FragColor = vec4(vec3(mask), 1.);
}