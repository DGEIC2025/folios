
async function loadTemplate(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load template: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return arrayBuffer;
}
 
async function generateDocument() {
    // Obtener los valores de todos los campos
    const noficio = document.getElementById('noficio').value.trim();
    const mes = document.getElementById('mes').value;
    const dia = document.getElementById('dia').value;
    const folio = document.getElementById('folio').value.trim();
    const oficio = document.getElementById('oficio').value.trim();
    const oficio2 = document.getElementById('oficio2').value.trim();
    const nombre = document.getElementById('nombre').value.trim();


    const campos = ['noficio', 'mes', 'dia', 'folio' , 'oficio' ,'oficio2' ,'nombre']


    // Verificar y resaltar campos vacíos
    let algunCampoVacio = false;

    // Iterar sobre los campos y verificar si están vacíos
    campos.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (!campo.value.trim()) {
            campo.classList.add('campo-vacio'); // Agregar clase campo-vacio si el campo está vacío
            algunCampoVacio = true;
        } else {
            campo.classList.remove('campo-vacio'); // Quitar clase campo-vacio si el campo está lleno
        }
    });

    if (algunCampoVacio) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Para generar el documento, es necesario llenar todos los campos del formulario. Favor de completar aquellos marcados en rojo.',
            confirmButtonText: 'Entendido'
        });
        return;
    }
    

    // Continuar con la generación del documento
    const templateUrl = '../documentos/1/1p.docx'; // URL o ruta del archivo de plantilla
    let arrayBuffer;

    try {
        arrayBuffer = await loadTemplate(templateUrl);
    } catch (error) {
        console.error(error);
        alert('Error al cargar la plantilla: ' + error.message);
        return;
    }

    const zip = new PizZip(arrayBuffer);
    const doc = new window.docxtemplater().loadZip(zip);

    doc.setData({
        noficio: noficio,
        mes: mes,
        dia: dia,
        folio: folio,
        oficio: oficio,
        oficio2: oficio2,
        nombre: nombre
    });

    try {
        doc.render();
    } catch (error) {
        const e = {
            stack: error.stack,
            properties: error.properties,
        };
        console.error(JSON.stringify({ error: e }, null, 2));
        alert('Error al generar el documento: ' + error.message);
        return;
    }

    const out = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const fileName = `Documento_${noficio || 'sinOficio'}.docx`;

    saveAs(out, fileName);
    
}
