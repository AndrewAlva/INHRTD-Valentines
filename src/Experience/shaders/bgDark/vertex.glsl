uniform sampler2D uDisplacementMap;
varying vec2 vUv;

void main()
{
    vec2 screenUV = (gl_Position.xy);
    vec2 dispUV = abs(uv - vec2(1., 0.));
    dispUV = dispUV * vec2(1., 0.5);
    dispUV.y += 0.08;
    dispUV = fract(dispUV * 5.);
    vec4 displacement = texture2D(uDisplacementMap, dispUV);

    vec3 pos = position;
    // pos *= pow(displacement.r, 1.) * 2.;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    vUv = uv;
}