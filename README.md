# 🏨 Administra - Sistema de Gestión Hotelera

> Sistema integral de administración para hoteles que centraliza operaciones financieras, bancarias y operativas en una sola plataforma.

## 📋 Descripción

**Administra** es una aplicación web moderna diseñada específicamente para la gestión administrativa de hoteles. Ofrece un conjunto completo de herramientas para manejar finanzas, conciliación bancaria, facturación, control de gastos, reportes y gestión de tareas operativas.

## ✨ Características Principales

### 💰 **Dashboard Financiero**

- Vista general de ingresos, gastos y utilidades del mes
- KPIs principales: Ventas Totales, Gastos Totales, Utilidad Neta, Margen de Utilidad
- Gráficos interactivos con Recharts
- Comparación con períodos anteriores
- Modo oscuro completo

### 💳 **Conciliación Bancaria**

- Gestión de múltiples cuentas bancarias
- Importación de movimientos desde CSV y Excel
- Sistema de conciliación interactivo
  - Click en "Pendiente" para revisar y conciliar
  - Diálogo de confirmación con selección de cuenta
  - Asignación directa de movimientos a cuentas específicas
- Filtros: Mostrar todos o solo pendientes
- Contador en tiempo real de movimientos conciliados vs pendientes
- Creación de nuevas cuentas bancarias desde la interfaz
- Visualización completa de todas las transacciones

### 🧾 **Facturación y Cobranza**

- Gestión de facturas con estados (Pendiente, Pagada, Vencida)
- Sistema dual de clientes:
  - **Clientes Existentes**: Empresas y clientes corporativos guardados
  - **Clientes Nuevos**: Ingreso rápido durante check-in de huéspedes
- Creación de facturas con datos completos:
  - Información del cliente (nombre, email, teléfono, DNI/Pasaporte)
  - Conceptos y montos
  - Cálculo automático de IVA y totales
  - Fechas de emisión y vencimiento
- Gestión de clientes corporativos

### 💸 **Control de Gastos**

- Registro detallado de egresos operativos
- Categorización por tipo:
  - Nómina
  - Mantenimiento
  - Suministros
  - Servicios
  - Marketing
  - Otros
- Adjuntar comprobantes (próximamente)
- Visualización por categoría con gráficos
- Filtros y búsqueda avanzada

### 📊 **Reportes y Análisis**

- **Indicadores Clave de Rendimiento (KPIs)**:
  - Ventas Totales del mes
  - Gastos Totales
  - Utilidad Neta
  - Margen de Utilidad (%)
  - Comparación con mes anterior
- **Análisis Financiero**:
  - Gráfico de barras comparativo (Ingresos vs Egresos)
  - Línea de utilidad mensual
  - Evolución de ventas mensuales
  - Distribución de gastos por categoría
- **Desglose Detallado**: Tablas con métricas específicas
- Generación de PDFs para reportes

### ✅ **Gestión de Tareas Operativas**

- Organización de actividades administrativas diarias
- Sistema de prioridades (Alta, Media, Baja)
- Estados: Pendiente / Completado
- Categorización por tipo:
  - Auditoría
  - Conciliación
  - Pagos
  - Reportes
- Asignación de tareas a miembros del equipo
- Control de fechas límite
- Panel informativo explicando funcionalidades

### ⚙️ **Configuración del Hotel**

- **Pestaña General**: Información básica del establecimiento
  - Nombre del hotel
  - Dirección completa
  - Teléfono y email de contacto
  - Logo del hotel
- **Pestaña Administración**: Datos del responsable administrativo
- **Pestaña Branding**: Personalización de marca

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Estilos**: Tailwind CSS
- **Componentes UI**: shadcn/ui
- **Gráficos**: Recharts
- **Iconos**: Lucide React
- **Generación PDF**: jsPDF
- **Routing**: React Router DOM
- **Gestión de Estado**: React Hooks

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/lucasromanh/Administra.git

# Entrar al directorio
cd Administra

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Producción
npm run build        # Construye la aplicación para producción
npm run preview      # Previsualiza la build de producción

# Calidad de código
npm run lint         # Ejecuta ESLint
```

## 🎨 Estructura del Proyecto

```
src/
├── components/          # Componentes React reutilizables
│   ├── banking/        # Componentes de conciliación bancaria
│   ├── billing/        # Componentes de facturación
│   ├── dashboard/      # Componentes del dashboard
│   ├── expenses/       # Componentes de gastos
│   ├── layout/         # Componentes de layout (Header, Sidebar)
│   ├── reports/        # Componentes de reportes
│   ├── tasks/          # Componentes de tareas
│   └── ui/             # Componentes UI base (shadcn/ui)
├── hooks/              # Custom React Hooks
├── lib/                # Utilidades y helpers
│   ├── bank.ts         # Lógica de conciliación bancaria
│   ├── reports-pdf.ts  # Generación de reportes PDF
│   └── types.ts        # Definiciones de TypeScript
├── pages/              # Páginas principales de la aplicación
└── App.tsx             # Componente raíz
```

## 🔑 Características Técnicas

### Responsive Design

- Diseño completamente adaptable a móviles, tablets y desktop
- Sidebar colapsable en dispositivos móviles
- Grid responsive en todas las secciones

### Modo Oscuro

- Soporte completo para tema oscuro
- Transiciones suaves entre temas
- Colores optimizados para legibilidad

### Optimización de UI/UX

- Diseño compacto y eficiente en el uso del espacio
- Feedback visual inmediato en todas las acciones
- Estados de carga y confirmación
- Tooltips informativos
- Animaciones sutiles y profesionales

### Arquitectura

- Componentes modulares y reutilizables
- Separación de lógica de negocio
- Custom hooks para gestión de estado
- TypeScript para type safety
- Código limpio y documentado

## 🎯 Casos de Uso

### 1. Conciliación Diaria

1. Cargar archivo CSV/Excel del banco
2. Revisar movimientos importados
3. Para cada movimiento pendiente:
   - Click en "Pendiente"
   - Revisar información del movimiento
   - Seleccionar cuenta bancaria correspondiente
   - Confirmar conciliación
4. Usar filtro "Solo Pendientes" para enfocarse en lo que falta
5. Al finalizar, todos los movimientos están conciliados y asignados

### 2. Facturación de Check-in

1. Huésped nuevo hace check-in
2. Click en "Nueva Factura"
3. Seleccionar "Cliente Nuevo (Check-in)"
4. Ingresar datos del huésped
5. Agregar concepto y montos
6. Crear factura
7. Cliente queda guardado para futuras facturas

### 3. Control Mensual de Gastos

1. Acceder a sección "Gastos"
2. Registrar cada egreso con categoría
3. Visualizar distribución en gráfico circular
4. Generar reporte PDF al fin de mes

### 4. Revisión Gerencial

1. Acceder al Dashboard
2. Ver KPIs del mes actual
3. Comparar con mes anterior
4. Revisar gráficos de ingresos vs egresos
5. Descargar reportes detallados

## 🔐 Seguridad y Datos

- Los datos se almacenan localmente en el navegador
- No hay conexión a backend (versión actual)
- Preparado para integración con API REST
- Validación de formularios en todos los inputs

## 🚧 Próximas Funcionalidades

- [ ] Integración con backend (API REST)
- [ ] Autenticación de usuarios
- [ ] Exportación de datos a Excel
- [ ] Integración directa con APIs bancarias
- [ ] Adjuntar comprobantes de gastos
- [ ] Recordatorios automáticos de vencimientos
- [ ] Dashboard de ocupación hotelera
- [ ] Gestión de reservas

## 👥 Autor

**Lucas Roman**

- GitHub: [@lucasromanh](https://github.com/lucasromanh)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si encuentras algún bug o tienes sugerencias, por favor abre un issue en GitHub.

---

<p align="center">Hecho con ❤️ para la industria hotelera</p>
