uniform vec3 uColorInside;
uniform vec3 uColorOutside;
uniform sampler2D uMap;
uniform float uTransition;

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

void main()
{
    // Radial gradient bg
    vec2 bgUV = rotateUV(vUv, -0.5, vec2(0.5));
    bgUV = bgUV * vec2(1., 1.3);
    float start = 0.01;
    float fade = 0.12;
    float fadeColor = 0.22;

    float circle = length(bgUV - vec2(0.485, 0.725));

    float lerp = smoothstep(start, start + fade, circle);
    vec3 color = mix(uColorInside, uColorOutside, lerp);


    // Base text texture (Mine for eternity)
    vec3 textColor = vec3(1., 0.1647, 0.345);
    float lerpTextColor = smoothstep(start, start + fadeColor, circle);
    textColor = mix(textColor, uColorOutside, lerpTextColor);

    vec2 tileUV = abs(vUv - vec2(1., 0.));
    tileUV = fract(tileUV * 17.);
    vec3 tileColor = vec3(tileUV, 1.);
    vec4 texel = texture2D(uMap, tileUV);
    texel.a = texel.r;

    texel.rgb *= textColor;
    color = mix(color, texel.rgb, texel.a);


    float alpha = uTransition;

    gl_FragColor = vec4(color, alpha);
}