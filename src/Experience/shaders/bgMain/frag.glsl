uniform vec3 uColorTop;
uniform vec3 uColorBottom;

varying vec2 vUv;

void main()
{
    float start = 0.045;
    float fade = 0.07;

    float circle = length(vUv - vec2(0.5, 0.52));

    float lerp = smoothstep(start, start + fade, circle);
    vec3 color = mix(uColorTop, uColorBottom, lerp);

    gl_FragColor = vec4(color, 1.0);
}