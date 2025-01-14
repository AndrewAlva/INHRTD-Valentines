uniform sampler2D uMap;
uniform vec3 uColor;
uniform float uTransition;

varying vec2 vUv;

void main()
{
    vec4 texel = texture2D(uMap, vUv);
    vec3 color = texel.rgb;

    float alpha = uTransition * texel.a;

    gl_FragColor = vec4(color, alpha);
}