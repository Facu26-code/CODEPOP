let baseDatos = JSON.parse(localStorage.getItem('CODEPOP_DB')) || []; 
let clienteActualIndex = null; 

// --- BASE DE PRECIOS DE MERCADO --- 
const PRECIOS_MERCADO = { 
    "material": [ 
        { nombre: "Cable 2.5mm (Rollo)", precio: 45000 }, 
        { nombre: "Cable 1.5mm (Rollo)", precio: 38000 }, 
        { nombre: "Tecla Punto y Toma", precio: 3500 }, 
        { nombre: "Cinta Aisladora", precio: 1500 }, 
        { nombre: "Aceite 10w40", precio: 12000 }, 
        { nombre: "Filtro de Aire", precio: 8000 }, 
        { nombre: "Formularios Tipo 08", precio: 5000 } 
    ], 
    // LISTA DE MANO DE OBRA ACTUALIZADA 
    "mano_obra": { 
        "⚡ Electricidad": [ 
            { nombre: "Boca de luz (Instalación)", precio: 15000 }, 
            { nombre: "Cambio de Térmica", precio: 25000 }, 
            { nombre: "Urgencia 24hs", precio: 40000 } 
        ], 
        "🔧 Mecánica": [ 
            { nombre: "Electricidad Automotriz", precio: 25000 }, 
            { nombre: "Escaneo Computarizado", precio: 20000 }, 
            { nombre: "Mecánica Integral", precio: 30000 }, 
            { nombre: "Cambio de Aceite", precio: 10000 } 
        ], 
        "📋 Gestor Automotor": [ 
            { nombre: "Transferencia Automotor", precio: 50000 }, 
            { nombre: "Cambio de Dominio", precio: 40000 }, 
            { nombre: "Cédula Azul/Verde", precio: 15000 }, 
            { nombre: "Informe de Dominio", precio: 10000 } 
        ], 
        "🔥 Gasista": [ 
            { nombre: "Instalación Estufa", precio: 35000 }, 
            { nombre: "Búsqueda de Fuga", precio: 40000 }, 
            { nombre: "Matriculación", precio: 60000 } 
        ], 
        "🛠️ Varios": [ 
            { nombre: "Trabajos de Oficina", precio: 10000 }, 
            { nombre: "Finanzas / Contador", precio: 20000 }, 
            { nombre: "Trámites Generales", precio: 8000 } 
        ] 
    } 
}; 

// --- GESTIÓN DE CLIENTES --- 

const crearNuevoCliente = () => { 
    let nombre = document.getElementById('nuevoClienteInput').value; 
    let rubro = document.getElementById('rubroInput').value; 
     
    if (nombre === "") { 
        Swal.fire({ title: 'Falta nombre', icon: 'warning', background: '#1a1a2e', color: '#fff', confirmButtonText: 'OK' }); 
        return; 
    } 

    let nuevoCliente = { 
        id: Date.now(),  
        nombre: nombre, 
        rubro: rubro, 
        estado: 'Presupuestado',
        items: []  
    }; 

    baseDatos.push(nuevoCliente); 
    guardarDB(); 
     
    document.getElementById('nuevoClienteInput').value = ""; 
    mostrarClientes();  
} 

const mostrarClientes = () => { 
    let listaHTML = document.getElementById('listaClientesVisual'); 
    let buscador = document.getElementById('buscadorInput').value.toLowerCase();
    
    listaHTML.innerHTML = ""; 

    let clientesFiltrados = baseDatos.filter(cliente => 
        cliente.nombre.toLowerCase().includes(buscador)
    );

    if(baseDatos.length === 0) { 
        listaHTML.innerHTML = "<p style='color:var(--text-secondary); font-size: 0.9em;'>No hay proyectos registrados.</p>"; 
        return; 
    } 

    if (clientesFiltrados.length === 0) {
        listaHTML.innerHTML = "<p style='color:var(--text-secondary); font-size: 0.9em;'>No se encontraron resultados.</p>"; 
        return;
    }

    // Nota: Usamos baseDatos.indexOf para obtener el índice real, ya que el filter cambia los índices
    clientesFiltrados.forEach((cliente) => { 
        let index = baseDatos.indexOf(cliente);
        let totalItems = cliente.items.length; 
        let rubroMostrar = cliente.rubro || '🛠️ Varios';  
        let estado = cliente.estado || 'Presupuestado';
         
        let li = document.createElement('li');
        
        // Estilo borde según estado (Professional Colors)
        if(estado === 'En Progreso') li.style.borderLeftColor = 'var(--info-color)'; 
        else if(estado === 'Terminado') li.style.borderLeftColor = 'var(--success-color)'; 
        else if(estado === 'Cobrado') li.style.borderLeftColor = 'var(--warning-color)'; 
        else li.style.borderLeftColor = 'var(--primary-color)'; 

        let divInfo = document.createElement('div');
        divInfo.className = 'info-producto';

        let spanNombre = document.createElement('span');
        spanNombre.className = 'nombre-item';
        spanNombre.textContent = cliente.nombre;

        let divBadges = document.createElement('div');
        divBadges.style.display = 'flex';
        divBadges.style.gap = '5px';
        divBadges.style.marginTop = '4px';

        let spanRubro = document.createElement('span');
        spanRubro.className = 'rubro-badge';
        spanRubro.textContent = rubroMostrar;

        let spanEstado = document.createElement('span');
        spanEstado.className = 'rubro-badge';
        
        // Estado Badge Styling
        spanEstado.style.backgroundColor = '#f1f5f9';
        spanEstado.style.color = 'var(--text-secondary)';
        spanEstado.style.marginLeft = '0';
        
        if(estado === 'En Progreso') { spanEstado.style.backgroundColor = '#ecfeff'; spanEstado.style.color = '#0e7490'; }
        if(estado === 'Terminado') { spanEstado.style.backgroundColor = '#f0fdf4'; spanEstado.style.color = '#15803d'; }
        if(estado === 'Cobrado') { spanEstado.style.backgroundColor = '#fffbeb'; spanEstado.style.color = '#b45309'; }

        spanEstado.textContent = estado;
        
        divBadges.appendChild(spanRubro);
        divBadges.appendChild(spanEstado);

        let spanDetalle = document.createElement('span');
        spanDetalle.className = 'detalle-item';
        spanDetalle.textContent = totalItems + ' items';

        divInfo.appendChild(spanNombre);
        divInfo.appendChild(divBadges);
        divInfo.appendChild(spanDetalle);

        let divAcciones = document.createElement('div');
        divAcciones.className = 'acciones';

        let btnDelete = document.createElement('button');
        btnDelete.className = 'btn-delete';
        btnDelete.textContent = 'Eliminar';
        btnDelete.onclick = () => borrarCliente(index);

        let btnOpen = document.createElement('button');
        btnOpen.className = 'btn-open';
        btnOpen.textContent = 'Abrir';
        btnOpen.onclick = () => abrirPresupuesto(index);

        divAcciones.appendChild(btnDelete);
        divAcciones.appendChild(btnOpen);

        li.appendChild(divInfo);
        li.appendChild(divAcciones);
        
        listaHTML.appendChild(li);
    }); 
} 

const borrarCliente = (index) => { 
    Swal.fire({ 
        title: '¿Eliminar Proyecto?', 
        text: "Esta acción no se puede deshacer.", 
        icon: 'warning', 
        showCancelButton: true, 
        confirmButtonColor: '#ef4444', 
        cancelButtonColor: '#64748b', 
        confirmButtonText: 'Sí, eliminar', 
        cancelButtonText: 'Cancelar' 
    }).then((result) => { 
        if (result.isConfirmed) { 
            baseDatos.splice(index, 1); 
            guardarDB(); 
            mostrarClientes(); 
        } 
    }) 
} 

const abrirPresupuesto = (index) => { 
    clienteActualIndex = index; 
    let cliente = baseDatos[index]; 

    document.getElementById('tituloPresupuesto').innerText = "Proyecto: " + cliente.nombre; 
    document.getElementById('subtituloRubro').innerText = cliente.rubro || "Rubro: Varios"; 
    
    // Set estado
    let estado = cliente.estado || 'Presupuestado';
    document.getElementById('estadoProyectoInput').value = estado;

    document.getElementById('vista-clientes').style.display = 'none'; 
    document.getElementById('vista-presupuesto').style.display = 'block'; 

    document.getElementById('tipoItemInput').value = "material"; 
    cambiarPlaceholders(); 
    actualizarSugerencias(); 

    actualizarVistaPresupuesto(); 
} 

const volverInicio = () => { 
    clienteActualIndex = null;  
    document.getElementById('vista-presupuesto').style.display = 'none'; 
    document.getElementById('vista-clientes').style.display = 'block'; 
    mostrarClientes();  
} 

// --- LÓGICA INTELIGENTE DE PRECIOS Y VISIBILIDAD --- 

const cambiarPlaceholders = () => { 
    let tipo = document.getElementById('tipoItemInput').value; 
    let nombreInput = document.getElementById('nombreInput'); 
    let cantidadInput = document.getElementById('cantidadInput'); 
    let precioInput = document.getElementById('precioInput'); 

    if (tipo === 'mano_obra') { 
        nombreInput.placeholder = "Trabajo a realizar..."; 
        precioInput.placeholder = "$ Precio Final"; 
         
        cantidadInput.style.display = 'none'; 
        cantidadInput.value = 1;  
    } else { 
        nombreInput.placeholder = "Material (Ej: Cable)"; 
        precioInput.placeholder = "$ Precio Unitario"; 
         
        cantidadInput.style.display = 'inline-block'; 
        cantidadInput.value = "";  
    } 
    actualizarSugerencias(); 
} 

const actualizarSugerencias = () => { 
    let tipo = document.getElementById('tipoItemInput').value; 
    let cliente = baseDatos[clienteActualIndex]; 
    let rubro = cliente.rubro || "🛠️ Varios"; 
    let lista = document.getElementById('listaPrecios'); 
     
    lista.innerHTML = "";  

    let opciones = []; 

    if (tipo === 'material') { 
        opciones = PRECIOS_MERCADO.material; 
    } else { 
        opciones = PRECIOS_MERCADO.mano_obra[rubro] || PRECIOS_MERCADO.mano_obra["🛠️ Varios"]; 
    } 

    if (opciones) { 
        opciones.forEach(item => { 
            let option = document.createElement('option'); 
            option.value = item.nombre; 
            option.setAttribute('data-precio', item.precio);  
            lista.appendChild(option); 
        }); 
    } 
} 

const autocompletarPrecio = () => { 
    let nombreIngresado = document.getElementById('nombreInput').value; 
    let tipo = document.getElementById('tipoItemInput').value; 
    let cliente = baseDatos[clienteActualIndex]; 
    let rubro = cliente.rubro || "🛠️ Varios"; 

    let listaItems = []; 
    if (tipo === 'material') { 
        listaItems = PRECIOS_MERCADO.material; 
    } else { 
        listaItems = PRECIOS_MERCADO.mano_obra[rubro] || PRECIOS_MERCADO.mano_obra["🛠️ Varios"]; 
    } 

    let encontrado = listaItems.find(item => item.nombre === nombreIngresado); 

    if (encontrado) { 
        document.getElementById('precioInput').value = encontrado.precio; 
    } 
} 


// --- FUNCIONES DEL PRESUPUESTO --- 

const agregarProducto = () => { 
    let tipo = document.getElementById('tipoItemInput').value; 
    let nombre = document.getElementById('nombreInput').value; 
    let cantidad = document.getElementById('cantidadInput').value; 
    let precio = document.getElementById('precioInput').value; 

    if (nombre === "" || cantidad === "" || precio === "") return; 
    
    // Validation
    let cant = parseInt(cantidad);
    let prec = parseFloat(precio);

    if (cant <= 0 || prec < 0) {
        Swal.fire({ 
            title: 'Datos inválidos', 
            text: "Cantidad y precio deben ser positivos.", 
            icon: 'error'
        });
        return;
    }

    let nuevoItem = { 
        tipo: tipo, 
        nombre: nombre, 
        cantidad: cant,  
        precio: prec 
    }; 

    baseDatos[clienteActualIndex].items.push(nuevoItem); 
     
    document.getElementById('nombreInput').value =""; 
    if(tipo === 'material') document.getElementById('cantidadInput').value = ""; 
     
    document.getElementById('precioInput').value = ""; 
    document.getElementById('nombreInput').focus(); 
     
    guardarDB(); 
    actualizarVistaPresupuesto(); 
     
    Swal.fire({ 
        position: 'top-end', icon: 'success', title: 'Guardado',  
        showConfirmButton: false, timer: 1000 
    }); 
} 

const cambiarEstadoProyecto = () => {
    let nuevoEstado = document.getElementById('estadoProyectoInput').value;
    baseDatos[clienteActualIndex].estado = nuevoEstado;
    guardarDB();
}

const actualizarVistaPresupuesto = () => { 
    let contenedor = document.getElementById('contenedorListas'); 
    contenedor.innerHTML = ""; 
     
    let itemsCliente = baseDatos[clienteActualIndex].items; 
     
    let sumaMateriales = 0; 
    let sumaManoObra = 0; 
    
    let ulMateriales = document.createElement('ul');
    let ulManoObra = document.createElement('ul');

    let hasMateriales = false;
    let hasManoObra = false;

    itemsCliente.forEach((producto, i) => { 
        let subtotal = producto.cantidad * producto.precio; 
         
        if (producto.tipo === 'mano_obra') { 
            sumaManoObra += subtotal; 
        } else { 
            sumaMateriales += subtotal; 
        } 

        let li = document.createElement('li');
        if (producto.tipo === 'mano_obra') {
            li.className = 'mano-obra';
        }

        let divInfo = document.createElement('div');
        divInfo.className = 'info-producto';

        let spanNombre = document.createElement('span');
        spanNombre.className = 'nombre-item';

        if (producto.tipo !== 'mano_obra') {
             let spanCantidad = document.createElement('span');
             spanCantidad.className = 'cantidad-badge';
             spanCantidad.textContent = producto.cantidad + 'x';
             spanNombre.appendChild(spanCantidad);
        }

        let icono = (producto.tipo === 'mano_obra') ? '👷 ' : '🔩 ';
        spanNombre.appendChild(document.createTextNode(icono + producto.nombre));

        let spanDetalle = document.createElement('span');
        spanDetalle.className = 'detalle-item';
        spanDetalle.textContent = `$${producto.precio.toLocaleString()} | Sub: $${subtotal.toLocaleString()}`;

        divInfo.appendChild(spanNombre);
        divInfo.appendChild(spanDetalle);

        let divAcciones = document.createElement('div');
        divAcciones.className = 'acciones';

        let btnEdit = document.createElement('button');
        btnEdit.className = 'btn-edit';
        btnEdit.textContent = 'Editar';
        btnEdit.onclick = () => editarItem(i);

        let btnDelete = document.createElement('button');
        btnDelete.className = 'btn-delete';
        btnDelete.textContent = 'Eliminar';
        btnDelete.onclick = () => borrarItem(i);

        divAcciones.appendChild(btnEdit);
        divAcciones.appendChild(btnDelete);

        li.appendChild(divInfo);
        li.appendChild(divAcciones);

        if (producto.tipo === 'mano_obra') { 
            ulManoObra.appendChild(li);
            hasManoObra = true;
        } else { 
            ulMateriales.appendChild(li);
            hasMateriales = true;
        } 
    }); 

    if (hasMateriales) { 
        let titulo = document.createElement('div');
        titulo.className = 'titulo-seccion';
        titulo.textContent = '🔩 MATERIALES';
        contenedor.appendChild(titulo);
        contenedor.appendChild(ulMateriales);
    } 
    if (hasManoObra) { 
        let titulo = document.createElement('div');
        titulo.className = 'titulo-seccion';
        titulo.textContent = '👷 MANO DE OBRA';
        contenedor.appendChild(titulo);
        contenedor.appendChild(ulManoObra);
    } 
    if (itemsCliente.length === 0) { 
        let p = document.createElement('p');
        p.style.color = 'var(--text-secondary)';
        p.style.fontSize = '0.9em';
        p.textContent = 'No hay items cargados.';
        contenedor.appendChild(p);
    } 

    document.getElementById('totalMateriales').innerText = sumaMateriales.toLocaleString(); 
    document.getElementById('totalManoObra').innerText = sumaManoObra.toLocaleString(); 
    document.getElementById('precioTotal').innerText = (sumaMateriales + sumaManoObra).toLocaleString(); 
} 

const borrarItem = (i) => { 
    baseDatos[clienteActualIndex].items.splice(i, 1); 
    guardarDB(); 
    actualizarVistaPresupuesto(); 
} 

const editarItem = (i) => { 
    let item = baseDatos[clienteActualIndex].items[i]; 
     
    document.getElementById('nombreInput').value = item.nombre; 
    document.getElementById('cantidadInput').value = item.cantidad; 
    document.getElementById('precioInput').value = item.precio; 
     
    let selectTipo = document.getElementById('tipoItemInput'); 
    selectTipo.value = item.tipo || 'material'; 
     
    cambiarPlaceholders(); 

    borrarItem(i);  
} 

const guardarDB = () => { 
    localStorage.setItem('CODEPOP_DB', JSON.stringify(baseDatos)); 
} 

const descargarExcel = () => { 
    let cliente = baseDatos[clienteActualIndex]; 
    if (cliente.items.length === 0) { 
        Swal.fire({ icon: 'info', title: 'Vacío', text: 'No hay items para exportar.' }); 
        return; 
    } 

    let datos = cliente.items.map(item => ({ 
        "Tipo": (item.tipo === 'mano_obra') ? "Mano de Obra" : "Material", 
        "Descripción": item.nombre,  
        "Cantidad": (item.tipo === 'mano_obra') ? '-' : item.cantidad,  
        "Precio Unitario": item.precio,  
        "Subtotal": item.cantidad * item.precio 
    })); 

    let hoja = XLSX.utils.json_to_sheet(datos); 
    let libro = XLSX.utils.book_new(); 
    XLSX.utils.book_append_sheet(libro, hoja, "Presupuesto"); 
    XLSX.writeFile(libro, "Presupuesto_" + cliente.nombre + ".xlsx"); 
} 

const descargarPDF = () => {
    let cliente = baseDatos[clienteActualIndex];
    if (cliente.items.length === 0) {
        Swal.fire({ icon: 'info', title: 'Vacío', text: 'No hay items para exportar.' });
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configuración de estilo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    
    // Encabezado
    doc.text("PRESUPUESTO", 105, 20, null, null, "center");
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Cliente: ${cliente.nombre}`, 20, 40);
    doc.text(`Rubro: ${cliente.rubro || 'Varios'}`, 20, 50);
    doc.text(`Estado: ${cliente.estado || 'Presupuestado'}`, 20, 60);
    
    let fecha = new Date().toLocaleDateString();
    doc.text(`Fecha: ${fecha}`, 150, 40);

    // Tabla de items
    let columns = ["Tipo", "Descripción", "Cant.", "Precio Unit.", "Subtotal"];
    let rows = cliente.items.map(item => [
        (item.tipo === 'mano_obra') ? "Mano de Obra" : "Material",
        item.nombre,
        (item.tipo === 'mano_obra') ? '-' : item.cantidad,
        `$${item.precio.toLocaleString()}`,
        `$${(item.cantidad * item.precio).toLocaleString()}`
    ]);

    // Calcular totales
    let totalMateriales = 0;
    let totalManoObra = 0;
    cliente.items.forEach(i => {
        if(i.tipo === 'mano_obra') totalManoObra += (i.cantidad * i.precio);
        else totalMateriales += (i.cantidad * i.precio);
    });
    let total = totalMateriales + totalManoObra;

    doc.autoTable({
        startY: 70,
        head: [columns],
        body: rows,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' }, // Blue 500
        styles: { fontSize: 10, cellPadding: 3 },
    });

    // Totales al final
    let finalY = doc.lastAutoTable.finalY + 10;
    
    doc.setFontSize(10);
    doc.text(`Total Materiales: $${totalMateriales.toLocaleString()}`, 140, finalY);
    doc.text(`Total Mano de Obra: $${totalManoObra.toLocaleString()}`, 140, finalY + 7);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(`TOTAL: $${total.toLocaleString()}`, 140, finalY + 18);

    doc.save(`Presupuesto_${cliente.nombre}.pdf`);
}

const compartirWhatsapp = () => { 
    let cliente = baseDatos[clienteActualIndex]; 
    let items = cliente.items; 
     
    if (items.length === 0) { 
        Swal.fire({ icon: 'info', title: 'Vacío', text: 'Nada para enviar.' }); 
        return; 
    } 

    let mat = 0; 
    let mo = 0; 
    items.forEach(i => { 
        if(i.tipo === 'mano_obra') mo += (i.cantidad * i.precio); 
        else mat += (i.cantidad * i.precio); 
    }); 
    let total = mat + mo; 

    let texto = `Hola ${cliente.nombre}. Te paso el presupuesto de ${cliente.rubro || 'la obra'}:\n\n` + 
                `🔩 Materiales: $${mat.toLocaleString()}\n` + 
                `👷 Mano de Obra: $${mo.toLocaleString()}\n` + 
                `💰 *TOTAL: $${total.toLocaleString()}*\n\n` + 
                `Avísame si avanzamos.`; 

    let textoCodificado = encodeURIComponent(texto); 
    window.open(`https://wa.me/?text=${textoCodificado}`, '_blank'); 
} 

// --- BACKUP / RESTORE ---

const exportarBackup = () => {
    const dataStr = JSON.stringify(baseDatos);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'codepop_backup_' + new Date().toISOString().slice(0,10) + '.json';
    
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

const importarBackup = (input) => {
    let file = input.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = (e) => {
        try {
            let importedData = JSON.parse(e.target.result);
            if (Array.isArray(importedData)) {
                baseDatos = importedData;
                guardarDB();
                mostrarClientes();
                Swal.fire({ icon: 'success', title: 'Restaurado', text: 'Base de datos restaurada correctamente.' });
            } else {
                throw new Error("Formato inválido");
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'El archivo no es válido.' });
        }
    };
    reader.readAsText(file);
    // Reset input so the same file can be selected again if needed
    input.value = ''; 
}
 
// --- INICIALIZACIÓN Y EVENTOS --- 
 
mostrarClientes(); 

document.getElementById('tipoItemInput').addEventListener('change', cambiarPlaceholders); 
document.getElementById('nombreInput').addEventListener('input', autocompletarPrecio); 

// Teclas Rápidas 
 document.getElementById('nombreInput').addEventListener('keydown', (e) => { 
    if (e.key === "Enter") { e.preventDefault(); document.getElementById('cantidadInput').focus(); } 
}); 
document.getElementById('cantidadInput').addEventListener('keydown', (e) => { 
    if (e.key === "Enter") { e.preventDefault(); document.getElementById('precioInput').focus(); } 
}); 
document.getElementById('precioInput').addEventListener('keydown', (e) => { 
    if (e.key === "Enter") agregarProducto(); 
}); 
