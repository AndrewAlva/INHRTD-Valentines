uniform vec3 uColorTop;
uniform vec3 uColorBottom;

varying vec2 vUv;

void main()
{
    float start = 0.09;
    float fade = 0.1;

    float circle = length(vUv - 0.5);

    float lerp = smoothstep(start, start + fade, circle);
    vec3 color = mix(uColorTop, uColorBottom, lerp);

    gl_FragColor = vec4(color, 1.0);
}