let baseDatos = JSON.parse(localStorage.getItem('CODEPOP_DB')) || []; 
let clienteActualIndex = null; 

// --- BASE DE PRECIOS DE MERCADO --- 
const PRECIOS_DEFAULT = { 
    "material": [ 
        { nombre: "Cable 2.5mm (Rollo)", precio: 45000 }, 
        { nombre: "Cable 1.5mm (Rollo)", precio: 38000 }, 
        { nombre: "Tecla Punto y Toma", precio: 3500 }, 
        { nombre: "Cinta Aisladora", precio: 1500 }, 
        { nombre: "Aceite 10w40", precio: 12000 }, 
        { nombre: "Filtro de Aire", precio: 8000 }, 
        { nombre: "Formularios Tipo 08", precio: 5000 } 
    ], 
    "mano_obra": { 
        "Electricidad": [ 
            { nombre: "Boca de luz (Instalación)", precio: 15000 }, 
            { nombre: "Cambio de Térmica", precio: 25000 }, 
            { nombre: "Urgencia 24hs", precio: 40000 } 
        ], 
        "Mecánica": [ 
            { nombre: "Electricidad Automotriz", precio: 25000 }, 
            { nombre: "Escaneo Computarizado", precio: 20000 }, 
            { nombre: "Mecánica Integral", precio: 30000 }, 
            { nombre: "Cambio de Aceite", precio: 10000 } 
        ], 
        "Gestoría": [ 
            { nombre: "Transferencia Automotor", precio: 50000 }, 
            { nombre: "Cambio de Dominio", precio: 40000 }, 
            { nombre: "Cédula Azul/Verde", precio: 15000 }, 
            { nombre: "Informe de Dominio", precio: 10000 } 
        ], 
        "Gasista": [ 
            { nombre: "Instalación Estufa", precio: 35000 }, 
            { nombre: "Búsqueda de Fuga", precio: 40000 }, 
            { nombre: "Matriculación", precio: 60000 } 
        ], 
        "Varios": [ 
            { nombre: "Trabajos de Oficina", precio: 10000 }, 
            { nombre: "Finanzas / Contador", precio: 20000 }, 
            { nombre: "Trámites Generales", precio: 8000 } 
        ] 
    } 
};

let basePrecios = JSON.parse(localStorage.getItem('CODEPOP_PRECIOS')) || PRECIOS_DEFAULT;

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
    document.getElementById('vista-gestion-precios').style.display = 'none'; 
    document.getElementById('vista-clientes').style.display = 'block'; 
    mostrarClientes();  
} 

// --- GESTOR DE PRECIOS ---

const abrirGestorPrecios = () => {
    document.getElementById('vista-clientes').style.display = 'none';
    document.getElementById('vista-gestion-precios').style.display = 'block';
    
    // Setup event listener for type change
    document.getElementById('nuevoPrecioTipo').onchange = (e) => {
        const rubroContainer = document.getElementById('rubroSelectorContainer');
        rubroContainer.style.display = e.target.value === 'mano_obra' ? 'block' : 'none';
    };
    
    renderTablaPrecios();
}

const renderTablaPrecios = () => {
    const container = document.getElementById('listaPreciosContainer');
    container.innerHTML = "";
    
    // Render Materials
    let html = '<div class="titulo-seccion">Materiales</div><ul>';
    basePrecios.material.forEach((item, index) => {
        html += createPriceListItem(item.nombre, item.precio, 'material', index);
    });
    html += '</ul>';
    
    // Render Labor by Category
    for (const [rubro, items] of Object.entries(basePrecios.mano_obra)) {
        html += `<div class="titulo-seccion">${rubro}</div><ul>`;
        items.forEach((item, index) => {
            html += createPriceListItem(item.nombre, item.precio, 'mano_obra', index, rubro);
        });
        html += '</ul>';
    }
    
    container.innerHTML = html;
}

const createPriceListItem = (nombre, precio, type, index, rubro = null) => {
    // We construct HTML string here but careful with XSS if name is malicious.
    // However, since this is a management view and we want to use innerHTML for the big list structure efficiently...
    // Let's allow it but we should ideally sanitize `nombre`.
    // For consistency with previous fixes, let's build elements or sanitize.
    // Given the complexity of building nested ULs with innerHTML vs createElement, I'll sanitize the name.
    const safeName = nombre.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const rubroAttr = rubro ? `data-rubro="${rubro}"` : '';
    
    return `
        <li>
            <div class="info-producto">
                <span class="nombre-item">${safeName}</span>
                <span class="detalle-item">$${precio.toLocaleString()}</span>
            </div>
            <div class="acciones">
                <button class="btn-delete" onclick="eliminarPrecioItem('${type}', ${index}, '${rubro || ''}')">X</button>
            </div>
        </li>
    `;
}

const agregarPrecioItem = () => {
    const tipo = document.getElementById('nuevoPrecioTipo').value;
    const rubro = document.getElementById('nuevoPrecioRubro').value;
    const nombre = document.getElementById('nuevoPrecioNombre').value;
    const valor = parseFloat(document.getElementById('nuevoPrecioValor').value);
    
    if(!nombre || valor < 0 || isNaN(valor)) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Nombre y precio válidos requeridos.' });
        return;
    }
    
    const newItem = { nombre, precio: valor };
    
    if (tipo === 'material') {
        basePrecios.material.push(newItem);
    } else {
        if (!basePrecios.mano_obra[rubro]) basePrecios.mano_obra[rubro] = [];
        basePrecios.mano_obra[rubro].push(newItem);
    }
    
    guardarPreciosDB();
    renderTablaPrecios();
    
    document.getElementById('nuevoPrecioNombre').value = '';
    document.getElementById('nuevoPrecioValor').value = '';
    
    Swal.fire({ icon: 'success', title: 'Agregado', timer: 1000, showConfirmButton: false });
}

const eliminarPrecioItem = (type, index, rubro) => {
    Swal.fire({ 
        title: '¿Eliminar?', 
        icon: 'warning', 
        showCancelButton: true, 
        confirmButtonColor: '#ef4444', 
        confirmButtonText: 'Sí' 
    }).then((result) => {
        if (result.isConfirmed) {
            if (type === 'material') {
                basePrecios.material.splice(index, 1);
            } else {
                basePrecios.mano_obra[rubro].splice(index, 1);
            }
            guardarPreciosDB();
            renderTablaPrecios();
        }
    });
}

const guardarPreciosDB = () => {
    localStorage.setItem('CODEPOP_PRECIOS', JSON.stringify(basePrecios));
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
        opciones = basePrecios.material; 
    } else { 
        opciones = basePrecios.mano_obra[rubro] || basePrecios.mano_obra["Varios"]; 
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
        listaItems = basePrecios.material; 
    } else { 
        listaItems = basePrecios.mano_obra[rubro] || basePrecios.mano_obra["Varios"]; 
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
        if(cant <= 0) document.getElementById('cantidadInput').classList.add('input-error');
        if(prec < 0) document.getElementById('precioInput').classList.add('input-error');
        
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
    // Logo
    let logoData = localStorage.getItem('CODEPOP_LOGO');
    if(logoData) {
        doc.addImage(logoData, 'PNG', 20, 10, 30, 30);
    }

    doc.text("PRESUPUESTO", 105, 25, null, null, "center");
    
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

// --- BACKUP / RESTORE / DELETE ---

const borrarTodo = () => {
    Swal.fire({ 
        title: '¿Estás seguro?', 
        text: "Se eliminarán TODOS los proyectos. Esta acción es irreversible.", 
        icon: 'warning', 
        showCancelButton: true, 
        confirmButtonColor: '#ef4444', 
        cancelButtonColor: '#64748b', 
        confirmButtonText: 'Sí, borrar todo', 
        cancelButtonText: 'Cancelar' 
    }).then((result) => { 
        if (result.isConfirmed) { 
            baseDatos = [];
            guardarDB();
            mostrarClientes();
            Swal.fire({ icon: 'success', title: 'Eliminado', text: 'Se ha vaciado la bandeja de proyectos.' });
        } 
    }) 
}

const exportarBackup = async () => {
    if (baseDatos.length === 0) {
        Swal.fire({ icon: 'info', title: 'Vacío', text: 'No hay proyectos para exportar.' });
        return;
    }

    const { value: formValues } = await Swal.fire({
        title: 'Seleccionar Proyectos',
        html: '<div id="swal-export-list" style="text-align: left; max-height: 300px; overflow-y: auto;"></div>',
        didOpen: () => {
            const container = document.getElementById('swal-export-list');
            baseDatos.forEach((c, i) => {
                const div = document.createElement('div');
                div.style.marginBottom = '5px';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `chk_export_${i}`;
                checkbox.value = i;
                checkbox.checked = true;
                checkbox.style.width = 'auto';
                checkbox.style.marginRight = '5px';
                
                const label = document.createElement('label');
                label.htmlFor = `chk_export_${i}`;
                label.textContent = `${c.nombre} (${c.items.length} items)`;
                
                div.appendChild(checkbox);
                div.appendChild(label);
                container.appendChild(div);
            });
        },
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Exportar Seleccionados',
        preConfirm: () => {
            let selectedIndices = [];
            baseDatos.forEach((_, i) => {
                const checkbox = document.getElementById(`chk_export_${i}`);
                if (checkbox && checkbox.checked) {
                    selectedIndices.push(i);
                }
            });
            return selectedIndices;
        }
    });

    if (formValues && formValues.length > 0) {
        const selectedProjects = formValues.map(i => baseDatos[i]);
        const dataStr = JSON.stringify(selectedProjects, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        const exportFileDefaultName = 'codepop_proyectos_' + new Date().toISOString().slice(0,10) + '.json';
        
        let linkElement = document.createElement('a');
        linkElement.href = url;
        linkElement.download = exportFileDefaultName;
        linkElement.click();
        
        URL.revokeObjectURL(url);
    }
}

const importarBackup = (input) => {
    let file = input.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = async (e) => {
        try {
            let importedData = JSON.parse(e.target.result);
            if (!Array.isArray(importedData)) {
                throw new Error("Formato inválido");
            }

            const { value: selectedIndices } = await Swal.fire({
                title: 'Restaurar Proyectos',
                html: '<div id="swal-import-list" style="text-align: left; max-height: 300px; overflow-y: auto;"></div>',
                didOpen: () => {
                    const container = document.getElementById('swal-import-list');
                    importedData.forEach((c, i) => {
                        const div = document.createElement('div');
                        div.style.marginBottom = '5px';
                        
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.id = `chk_import_${i}`;
                        checkbox.value = i;
                        checkbox.checked = true;
                        checkbox.style.width = 'auto';
                        checkbox.style.marginRight = '5px';
                        
                        const label = document.createElement('label');
                        label.htmlFor = `chk_import_${i}`;
                        // Safe text insertion
                        label.textContent = `${c.nombre} (${c.items ? c.items.length : 0} items)`;
                        
                        div.appendChild(checkbox);
                        div.appendChild(label);
                        container.appendChild(div);
                    });
                },
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Importar Seleccionados',
                preConfirm: () => {
                    let indices = [];
                    importedData.forEach((_, i) => {
                        const checkbox = document.getElementById(`chk_import_${i}`);
                        if (checkbox && checkbox.checked) {
                            indices.push(i);
                        }
                    });
                    return indices;
                }
            });

            if (selectedIndices && selectedIndices.length > 0) {
                let count = 0;
                selectedIndices.forEach(i => {
                    let proj = importedData[i];
                    // Generate a new ID to avoid collisions
                    proj.id = Date.now() + Math.random(); 
                    baseDatos.push(proj);
                    count++;
                });
                
                guardarDB();
                mostrarClientes();
                Swal.fire({ icon: 'success', title: 'Restaurado', text: `${count} proyectos importados correctamente.` });
            }

        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'El archivo no es válido.' });
        }
        // Reset input
        input.value = ''; 
    };
    reader.readAsText(file);
}

// --- LOGO ---

const guardarLogo = (input) => {
    let file = input.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = (e) => {
        localStorage.setItem('CODEPOP_LOGO', e.target.result);
        Swal.fire({ icon: 'success', title: 'Logo Guardado', text: 'El logo se usará en los PDFs.' });
    };
    reader.readAsDataURL(file);
}
 
// --- DARK MODE ---

const toggleTheme = () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('CODEPOP_THEME', newTheme);
    
    updateThemeIcon(newTheme);
}

const updateThemeIcon = (theme) => {
    const btn = document.getElementById('themeToggle');
    if(btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

const initTheme = () => {
    const savedTheme = localStorage.getItem('CODEPOP_THEME') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

// --- INICIALIZACIÓN Y EVENTOS --- 

initTheme();
mostrarClientes(); 

document.getElementById('tipoItemInput').addEventListener('change', cambiarPlaceholders); 
document.getElementById('nombreInput').addEventListener('input', autocompletarPrecio); 

// Teclas Rápidas 
 document.getElementById('nombreInput').addEventListener('keydown', (e) => { 
    if (e.key === "Enter") { e.preventDefault(); document.getElementById('cantidadInput').focus(); } 
}); 
document.getElementById('cantidadInput').addEventListener('keydown', (e) => { 
    document.getElementById('cantidadInput').classList.remove('input-error');
    if (e.key === "Enter") { e.preventDefault(); document.getElementById('precioInput').focus(); } 
}); 
document.getElementById('precioInput').addEventListener('keydown', (e) => { 
    document.getElementById('precioInput').classList.remove('input-error');
    if (e.key === "Enter") agregarProducto(); 
}); 
