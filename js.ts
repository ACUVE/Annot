import { AnnotUI } from "./module/Annot.js";


function main(){
    let ele = <HTMLCanvasElement>document.getElementById('canvas');
    let annot = new AnnotUI(ele);
}

if(document.readyState === 'loading'){
    window.addEventListener('DOMContentLoaded', main);
}else{
    main();
}
