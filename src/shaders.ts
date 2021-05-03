export const Shaders = () => {
    const vertex = `
    const pos : array<vec2<f32>, 6> = array<vec2<f32>, 6>(             
        vec2<f32>(-0.5,  0.7),
        vec2<f32>( 0.3,  0.6),
        vec2<f32>( 0.5,  0.3),
        vec2<f32>( 0.4, -0.5),
        vec2<f32>(-0.4, -0.4),
        vec2<f32>(-0.3,  0.2)
    );

    [[builtin(position)]] var<out> Position : vec4<f32>;
    [[builtin(vertex_idx)]] var<in> VertexIndex : i32;

    [[stage(vertex)]]
    fn main() -> void {
      Position = vec4<f32>(pos[VertexIndex], 0.0, 1.0);
      return;
    }`

    const fragment = `
        [[location(0)]] var<out> outColor : vec4<f32>;
        [[stage(fragment)]]
        fn main() -> void {
            outColor = vec4<f32>(1.0, 1.0, 0.0, 1.0);
            return;
        }
    `;
    return {vertex, fragment};
}
