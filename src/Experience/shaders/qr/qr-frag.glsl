uniform sampler2D uMap;
uniform sampler2D uMask;
uniform vec3 uColor;
uniform float uTransition;

varying vec2 vUv;

void main()
{
    vec4 texel = texture2D(uMap, vUv);
    vec3 color = texel.rgb;

    // Radial mask
    vec2 maskTexel = texture2D(uMask, vUv).rg;
    float t = 1.2 - uTransition;
    float mask = smoothstep(t - (0.2 * uTransition), t, maskTexel.r);
    // float mask = step(t, maskTexel.r);
    float borderMask = step(0.85, maskTexel.g);

    float alpha = mask * borderMask * texel.a;

    gl_FragColor = vec4(color, alpha);
    // gl_FragColor = vec4(vec3(mask), 1.);
}