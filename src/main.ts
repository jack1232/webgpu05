import $ from 'jquery';
import { CheckWebGPU } from './helper';
import { Shaders } from './shaders';

const CreatePrimitive = async (primitiveType = 'point-list') => { 
    const checkgpu = CheckWebGPU();
    if(checkgpu.includes('Your current browser does not support WebGPU!')){
        console.log(checkgpu);
        throw('Your current browser does not support WebGPU!');
    }

    let indexFormat = undefined;
    if(primitiveType === 'line-strip'){
        indexFormat = 'uint32'
    }
    
    const canvas = document.getElementById('canvas-webgpu') as HTMLCanvasElement;
    const adapter = await navigator.gpu?.requestAdapter() as GPUAdapter;       
    const device = await adapter?.requestDevice() as GPUDevice;
    const context = canvas.getContext('gpupresent') as unknown as GPUCanvasContext;

    const swapChainFormat = 'bgra8unorm';
    const swapChain = context.configureSwapChain({
        device: device,
        format: swapChainFormat,
    });

    const shader = Shaders();
    const pipeline = device.createRenderPipeline({
        vertexStage: {
            module: device.createShaderModule({
                code: shader.vertex
            }),
            entryPoint: "main"
        },
        fragmentStage: {
            module: device.createShaderModule({
                code: shader.fragment
            }),
            entryPoint: "main"
        },
        primitiveTopology: primitiveType as GPUPrimitiveTopology,
        colorStates: [{
            format: swapChainFormat
        }],
        vertexState:{
            indexFormat: indexFormat as GPUIndexFormat
        }
    });

    const commandEncoder = device.createCommandEncoder();
    const textureView = swapChain.getCurrentTexture().createView();
    const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
            attachment: textureView,
            loadValue: [0.5, 0.5, 0.8, 1] //background color
        }]
    });
    renderPass.setPipeline(pipeline);
    renderPass.draw(6, 1, 0, 0);
    renderPass.endPass();
    
    device.queue.submit([commandEncoder.finish()]);
}

CreatePrimitive();
$('#id-primitive').on('change', ()=>{
    const primitiveType = $('#id-primitive').val() as string;
    CreatePrimitive(primitiveType);
});


