import $ from 'jquery';
import { format } from 'path';
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
        vertex: {
            module: device.createShaderModule({
                code: shader.vertex
            }),
            entryPoint: "main"
        },
        fragment: {
            module: device.createShaderModule({
                code: shader.fragment
            }),
            entryPoint: "main",
            targets: [{
                format: swapChainFormat as GPUTextureFormat
            }]
        },
        primitive:{
            topology: primitiveType as GPUPrimitiveTopology,
            stripIndexFormat: indexFormat as GPUIndexFormat
        }
    });

    const commandEncoder = device.createCommandEncoder();
    const textureView = swapChain.getCurrentTexture().createView();
    
    const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
            view: textureView as GPUTextureView,
            loadValue: [0.5, 0.5, 0.8, 1], //background color
            storeOp: 'store'
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


