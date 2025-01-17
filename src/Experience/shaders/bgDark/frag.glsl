uniform vec3 uColorInside;
uniform vec3 uColorOutside;
uniform float uTransition;

varying vec2 vUv;

void main()
{
    float start = 0.02;
    float fade = 0.15;

    float circle = length(vUv - vec2(0.5, 0.48));

    float lerp = smoothstep(start, start + fade, circle);
    vec3 color = mix(uColorInside, uColorOutside, lerp);

    float alpha = uTransition;

    gl_FragColor = vec4(color, alpha);
}