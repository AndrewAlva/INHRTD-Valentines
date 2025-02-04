#define PI_2 6.2831853072

uniform vec2 uScreen;
uniform vec3 uColorInside;
uniform vec3 uColorOutside;
uniform sampler2D uMap;
uniform sampler2D uDisplacementMap;
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

    // Radial gradient bg
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
    vec2 tileUV = abs(vUv - vec2(1., 0.));
    vec2 textUV = screenUV;



    vec4 displacement = texture2D(uDisplacementMap, screenUV);
    displacement = 1. - displacement;
    // float strength = pow(displacement.r, 2.) * 3.;
    float strength = displacement.r * 3.;

    // tileUV.x += (strength) * 0.01;
    // tileUV.y += (uTime + strength) * 0.015;
    // tileUV.y += (uTime) * 0.015;


    // Waves
    // float waves = fract((screenUV.y * 10.) + cos(screenUV.x * 20.) * 0.3);
    float waves = screenUV.y - (cos(screenUV.x * PI_2 * 3.) * 0.175);
    textUV.y += waves;
    textUV.y *= 0.5;


    // Radial Circle
    // float radialCircle = 1. - (pow((1. - length(screenUV - 0.5)) * 1., 3.) - 0.2);
    float radialCircle = 1. - ( (1. - length(screenUV - 0.5)) - 0.75 );
    // textUV = scaleUV(textUV, vec2(radialCircle), textUV - 0.5);
    textUV = scaleUV(textUV, vec2(radialCircle), vec2(0.5));

    // Falling motion
    textUV.y += (uTime) * 0.09;


    // Repeat texture (tiling)
    // textUV = fract((textUV * 2.) - 0.5);
    textUV = fract(textUV * 3.);



    float text = msdf(uMap, textUV);
    vec3 color = mix(gradient, textColor, text);


    float alpha = uTransition;

    // vec3 tileColor = vec3(tileUV, 1.);
    // color += strength;
    gl_FragColor = vec4(color, alpha);
    // gl_FragColor = vec4(textUV, 1., 1.);
    // gl_FragColor = vec4(vec3(radialCircle), 1.);
    // gl_FragColor = vec4(displacement.rgb, 1.);
    // gl_FragColor = vec4( msdf(uMap, screenUV) );
}