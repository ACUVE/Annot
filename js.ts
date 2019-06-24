import { AnnotUI } from "./module/Annot.js";

function main(): void {
    const ele = <HTMLCanvasElement>document.getElementById('canvas');
    const annot = new AnnotUI(ele);

    const dragdrop = document.getElementById('dragdrop');
    if(dragdrop){
        dragdrop.addEventListener("dragover", (e: DragEvent) => {
            e.preventDefault();
        });
        // dragdrop.addEventListener("dragleave", dragleave);
        dragdrop.addEventListener("drop", (e: DragEvent) => {
            console.log(e);
            e.preventDefault();
            for(let file of e.dataTransfer.files){
                if(file.type.indexOf('image/')) continue;
                let url = URL.createObjectURL(file);
                let image = new Image();
                image.src = url;
                image.onload = () => {
                    annot.setImage(image);
                    URL.revokeObjectURL(url);
                };
            }
        });
    }
}

if(document.readyState === 'loading'){
    window.addEventListener('DOMContentLoaded', main);
}else{
    main();
}
