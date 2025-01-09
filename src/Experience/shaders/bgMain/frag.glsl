uniform vec3 uColorTop;
uniform vec3 uColorBottom;

varying vec2 vUv;

void main()
{
    float start = 0.21;
    float fade = 0.1;
    float lerp = smoothstep(start, start + fade, vUv.y);
    vec3 color = mix(uColorBottom, uColorTop, lerp);

    gl_FragColor = vec4(color, 1.0);
}