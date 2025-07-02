import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Recursos de traducción
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        dashboard: "Dashboard",
        projects: "Projects",
        modules: "Modules",
        features: "Features", 
        scenarios: "Scenarios",
        kanban: "Kanban Board",
        settings: "Settings"
      },
      // Common buttons and actions
      common: {
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        create: "Create",
        back: "Back",
        loading: "Loading...",
        saving: "Saving...",
        search: "Search",
        filter: "Filter",
        export: "Export",
        download: "Download",
        new: "New",
        actions: "Actions",
        view: "View",
        status: "Status",
        priority: "Priority",
        created: "Created",
        updated: "Updated",
        name: "Name",
        description: "Description",
        title: "Title",
        expandAll: "Expand All",
        collapseAll: "Collapse All",
        preview: "Preview",
        showPreview: "Show Preview",
        hidePreview: "Hide Preview"
      },
      // Dashboard
      dashboard: {
        title: "BDD Requirements Dashboard",
        stats: {
          totalProjects: "Total Projects",
          totalFeatures: "Total Features", 
          totalScenarios: "Total Scenarios",
          featuresStatus: "Features by Status",
          scenariosStatus: "Scenarios by Status"
        },
        quickActions: {
          title: "Quick Actions",
          newProject: "New Project",
          newModule: "New Module",
          manageWorkflow: "Manage Workflow"
        }
      },
      // Projects
      projects: {
        title: "Projects",
        newProject: "New Project",
        editProject: "Edit Project",
        projectName: "Project Name",
        projectDescription: "Project Description",
        projectNamePlaceholder: "Enter project name",
        projectDescriptionPlaceholder: "Enter project description",
        projectNameRequired: "Project name is required",
        noProjects: "No projects found",
        noProjectsFound: "No projects found",
        createFirst: "Create your first project to get started",
        createFirstProject: "Create your first project to manage your BDD requirements",
        createYourFirstProject: "Create Your First Project",
        createProject: "Create Project",
        notFound: "Project Not Found",
        notFoundMessage: "The project you're looking for doesn't exist.",
        backToProjects: "Back to Projects",
        selectProject: "Select Project",
        selectProjectDescription: "Select a project to start working",
        searchProjects: "Search projects...",
        tryDifferentSearch: "Try a different search"
      },
      // Modules
      modules: {
        title: "Modules",
        subtitle: "Organize your features by modules",
        newModule: "New Module",
        editModule: "Edit Module",
        moduleName: "Module Name",
        color: "Color",
        selectProject: "Select project",
        searchModules: "Search modules...",
        allProjects: "All Projects",
        allModules: "All Modules",
        noModules: "No modules found",
        noModulesYet: "No modules yet",
        createFirst: "Create your first module to get started",
        adjustFilters: "Try adjusting your search filters",
        selectModule: "Select a module",
        moduleRequired: "Module is required",
        noModulesForProject: "No modules available for this project. Create a module first.",
        notFound: "Module Not Found",
        notFoundMessage: "The module you're looking for doesn't exist.",
        backToModules: "Back to Modules"
      },
      // Features
      features: {
        title: "Features",
        newFeature: "New Feature",
        editFeature: "Edit Feature",
        featureTitle: "Feature Title",
        featureDescription: "Feature Description",
        userStory: "User Story",
        asA: "As a",
        iWant: "I want",
        soThat: "So that",
        project: "Project",
        module: "Module",
        tags: "Tags",
        downloadBDD: "Download BDD File",
        noFeatures: "No features found",
        createFirst: "Create your first feature to get started",
        notFound: "Feature Not Found",
        notFoundMessage: "The feature you're looking for doesn't exist.",
        backToFeatures: "Back to Features",
        priority: {
          low: "Low",
          medium: "Medium", 
          high: "High"
        },
        status: {
          draft: "Draft",
          in_progress: "In Progress",
          review: "Review",
          completed: "Completed",
          approved: "Approved",
          implemented: "Implemented"
        }
      },
      // Scenarios
      scenarios: {
        title: "Scenarios",
        create: "Create Scenario",
        edit: "Edit Scenario",
        newScenario: "New Scenario",
        editScenario: "Edit Scenario",
        name: "Scenario Name",
        scenarioTitle: "Scenario Title",
        scenarioDescription: "Scenario Description",
        description: "Description",
        feature: "Feature",
        given: "Given",
        when: "When",
        then: "Then",
        givenSteps: "Given Steps",
        whenSteps: "When Steps", 
        thenSteps: "Then Steps",
        namePlaceholder: "Enter scenario name",
        descriptionPlaceholder: "Enter scenario description (optional)",
        givenPlaceholder: "Describe the initial context or preconditions...",
        whenPlaceholder: "Describe the action or event that triggers the scenario...",
        thenPlaceholder: "Describe the expected outcome or result...",
        noScenarios: "No scenarios found",
        createFirst: "Create your first scenario for this feature",
        status: {
          draft: "Draft",
          ready: "Ready",
          passed: "Passed",
          failed: "Failed"
        }
      },
      // Messages
      messages: {
        success: {
          created: "Created successfully",
          updated: "Updated successfully", 
          deleted: "Deleted successfully"
        },
        error: {
          create: "Error creating item",
          update: "Error updating item",
          delete: "Error deleting item",
          load: "Error loading data"
        },
        confirm: {
          delete: "Are you sure you want to delete this item? This action cannot be undone."
        }
      },
      // Validation
      validation: {
        required: "This field is required"
      },
      // Testing
      testing: {
        title: "Test Execution",
        runTests: "Run Tests",
        running: "Running...",
        results: "Test Results",
        downloadResults: "Download Results",
        filterByTags: "Filter by Tags",
        selectedTags: "Selected tags",
        totalScenarios: "Total Scenarios",
        passed: "Passed",
        failed: "Failed",
        skipped: "Skipped",
        duration: "Duration",
        allTestsPassed: "All tests passed",
        someTestsFailed: "Some tests failed",
        detailedResults: "Detailed Results",
        errorOutput: "Error Output",
        noResults: "No test results available"
      },
      // Analytics
      analytics: {
        title: "Analytics",
        projectAnalytics: "Project Analytics",
        globalAnalytics: "Global Analytics",
        timeBasedAnalytics: "Time-Based Analytics",
        projectView: "Project View",
        globalView: "Global View",
        timeBasedView: "Time-Based View",
        totalFeatures: "Total Features",
        totalScenarios: "Total Scenarios",
        totalModules: "Total Modules",
        progressPercentage: "Progress",
        completed: "completed",
        pending: "pending",
        featuresByStatus: "Features by Status",
        featuresByPriority: "Features by Priority",
        moduleDistribution: "Module Distribution",
        weeklyTrends: "Weekly Trends",
        featureCoverage: "Feature Coverage",
        passedScenarios: "Passed",
        failedScenarios: "Failed",
        coverage: "Coverage",
        projectsActivity: "Projects Activity",
        qualityStats: "Quality Statistics",
        successRate: "Success Rate",
        mostUsedTags: "Most Used Tags",
        timeRange: "Time Range",
        last7Days: "Last 7 days",
        last30Days: "Last 30 days",
        last90Days: "Last 90 days",
        last180Days: "Last 180 days",
        downloadReport: "Download Report",
        reportDownloaded: "Report downloaded successfully",
        errorLoading: "Error loading analytics data",
        errorDownloading: "Error downloading report",
        noData: "No Analytics Data",
        noDataDescription: "No analytics data available for the selected criteria",
        selectProject: "Select a Project",
        selectProjectDescription: "Please select a project to view analytics",
        refresh: "Refresh"
      },
      // Kanban
      kanban: {
        title: "Kanban Board",
        subtitle: "Manage feature development workflow",
        searchFeatures: "Search features...",
        allProjects: "All Projects",
        noFeatures: "No features to display",
        createFirst: "Create your first feature to get started",
        adjustFilters: "Try adjusting your search filters",
        dropHere: "Drop here to change status"
      },
      // Language
      language: {
        title: "Language",
        english: "English",
        spanish: "Spanish"
      },
      // Navigation
      navigation: {
        accessRestricted: "Access Restricted",
        hierarchicalAccess: "Please follow the hierarchical navigation: Projects → Modules → Features → Scenarios",
        featuresAccess: "To access features, please start by selecting a project, then a module.",
        scenariosAccess: "To access scenarios, please start by selecting a project, then a module, then a feature."
      }
    }
  },
  es: {
    translation: {
      // Navegación
      nav: {
        dashboard: "Dashboard",
        projects: "Proyectos",
        modules: "Módulos",
        features: "Funcionalidades",
        scenarios: "Escenarios",
        kanban: "Tablero Kanban", 
        settings: "Configuración"
      },
      // Botones y acciones comunes
      common: {
        save: "Guardar",
        cancel: "Cancelar",
        delete: "Eliminar",
        edit: "Editar",
        create: "Crear",
        back: "Volver",
        loading: "Cargando...",
        saving: "Guardando...",
        search: "Buscar",
        filter: "Filtrar",
        export: "Exportar",
        download: "Descargar",
        new: "Nuevo",
        actions: "Acciones",
        view: "Ver",
        status: "Estado",
        priority: "Prioridad",
        created: "Creado",
        updated: "Actualizado",
        name: "Nombre",
        description: "Descripción",
        title: "Título",
        expandAll: "Expandir Todo",
        collapseAll: "Contraer Todo",
        preview: "Vista previa",
        showPreview: "Mostrar vista previa",
        hidePreview: "Ocultar vista previa"
      },
      // Dashboard
      dashboard: {
        title: "Dashboard de Requerimientos BDD",
        stats: {
          totalProjects: "Total de Proyectos",
          totalFeatures: "Total de Funcionalidades",
          totalScenarios: "Total de Escenarios",
          featuresStatus: "Funcionalidades por Estado",
          scenariosStatus: "Escenarios por Estado"
        },
        quickActions: {
          title: "Acciones Rápidas",
          newProject: "Nuevo Proyecto",
          newModule: "Nuevo Módulo",
          manageWorkflow: "Gestionar Flujo de Trabajo"
        }
      },
      // Proyectos
      projects: {
        title: "Proyectos",
        newProject: "Nuevo Proyecto",
        editProject: "Editar Proyecto",
        projectName: "Nombre del Proyecto",
        projectDescription: "Descripción del Proyecto",
        projectNamePlaceholder: "Ingrese el nombre del proyecto",
        projectDescriptionPlaceholder: "Ingrese una descripción del proyecto",
        projectNameRequired: "El nombre del proyecto es obligatorio",
        noProjects: "No se encontraron proyectos",
        noProjectsFound: "No se encontraron proyectos",
        createFirst: "Crea tu primer proyecto para comenzar",
        createFirstProject: "Crea tu primer proyecto para gestionar tus requerimientos BDD",
        createYourFirstProject: "Crear Tu Primer Proyecto",
        createProject: "Crear Proyecto",
        notFound: "Proyecto No Encontrado",
        notFoundMessage: "El proyecto que buscas no existe.",
        backToProjects: "Volver a Proyectos",
        selectProject: "Seleccionar Proyecto",
        selectProjectDescription: "Selecciona un proyecto para comenzar a trabajar",
        searchProjects: "Buscar proyectos...",
        tryDifferentSearch: "Intenta con una búsqueda diferente"
      },
      // Módulos
      modules: {
        title: "Módulos",
        subtitle: "Organiza tus funcionalidades por módulos",
        newModule: "Nuevo Módulo",
        editModule: "Editar Módulo",
        moduleName: "Nombre del Módulo",
        color: "Color",
        selectProject: "Seleccionar proyecto",
        searchModules: "Buscar módulos...",
        allProjects: "Todos los Proyectos",
        allModules: "Todos los Módulos",
        noModules: "No se encontraron módulos",
        noModulesYet: "Aún no hay módulos",
        createFirst: "Crea tu primer módulo para comenzar",
        adjustFilters: "Intenta ajustar tus filtros de búsqueda",
        selectModule: "Seleccionar un módulo",
        moduleRequired: "El módulo es obligatorio",
        noModulesForProject: "No hay módulos disponibles para este proyecto. Crea un módulo primero.",
        notFound: "Módulo No Encontrado",
        notFoundMessage: "El módulo que buscas no existe.",
        backToModules: "Volver a Módulos"
      },
      // Funcionalidades
      features: {
        title: "Funcionalidades",
        newFeature: "Nueva Funcionalidad",
        editFeature: "Editar Funcionalidad",
        featureTitle: "Título de la Funcionalidad",
        featureDescription: "Descripción de la Funcionalidad",
        userStory: "Historia de Usuario",
        asA: "Como",
        iWant: "Quiero",
        soThat: "Para que",
        project: "Proyecto",
        module: "Módulo",
        tags: "Etiquetas",
        downloadBDD: "Descargar Archivo BDD",
        noFeatures: "No se encontraron funcionalidades",
        createFirst: "Crea tu primera funcionalidad para comenzar",
        notFound: "Funcionalidad No Encontrada",
        notFoundMessage: "La funcionalidad que buscas no existe.",
        backToFeatures: "Volver a Funcionalidades",
        priority: {
          low: "Baja",
          medium: "Media",
          high: "Alta"
        },
        status: {
          draft: "Borrador",
          in_progress: "En Progreso",
          review: "Revisión",
          completed: "Completado",
          approved: "Aprobado",
          implemented: "Implementado"
        }
      },
      // Escenarios
      scenarios: {
        title: "Escenarios",
        create: "Crear Escenario",
        edit: "Editar Escenario",
        newScenario: "Nuevo Escenario",
        editScenario: "Editar Escenario",
        name: "Nombre del Escenario",
        scenarioTitle: "Título del Escenario",
        scenarioDescription: "Descripción del Escenario",
        description: "Descripción",
        feature: "Funcionalidad",
        given: "Dado",
        when: "Cuando",
        then: "Entonces",
        givenSteps: "Pasos Given",
        whenSteps: "Pasos When",
        thenSteps: "Pasos Then",
        namePlaceholder: "Ingresa el nombre del escenario",
        descriptionPlaceholder: "Ingresa una descripción del escenario (opcional)",
        givenPlaceholder: "Describe el contexto inicial o precondiciones...",
        whenPlaceholder: "Describe la acción o evento que desencadena el escenario...",
        thenPlaceholder: "Describe el resultado o desenlace esperado...",
        noScenarios: "No se encontraron escenarios",
        createFirst: "Crea tu primer escenario para esta funcionalidad",
        status: {
          draft: "Borrador",
          ready: "Listo",
          passed: "Exitoso",
          failed: "Fallido"
        }
      },
      // Mensajes
      messages: {
        success: {
          created: "Creado exitosamente",
          updated: "Actualizado exitosamente",
          deleted: "Eliminado exitosamente"
        },
        error: {
          create: "Error al crear elemento",
          update: "Error al actualizar elemento",
          delete: "Error al eliminar elemento",
          load: "Error al cargar datos"
        },
        confirm: {
          delete: "¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer."
        }
      },
      // Validación
      validation: {
        required: "Este campo es obligatorio"
      },
      // Testing
      testing: {
        title: "Ejecución de Tests",
        runTests: "Ejecutar Tests",
        running: "Ejecutando...",
        results: "Resultados de Tests",
        downloadResults: "Descargar Resultados",
        filterByTags: "Filtrar por Tags",
        selectedTags: "Tags seleccionados",
        totalScenarios: "Total Escenarios",
        passed: "Exitosos",
        failed: "Fallidos",
        skipped: "Omitidos",
        duration: "Duración",
        allTestsPassed: "Todos los tests pasaron",
        someTestsFailed: "Algunos tests fallaron",
        detailedResults: "Resultados Detallados",
        errorOutput: "Salida de Error",
        noResults: "No hay resultados de tests disponibles"
      },
      // Analytics
      analytics: {
        title: "Analytics",
        projectAnalytics: "Analytics del Proyecto",
        globalAnalytics: "Analytics Globales",
        timeBasedAnalytics: "Analytics por Tiempo",
        projectView: "Vista de Proyecto",
        globalView: "Vista Global",
        timeBasedView: "Vista por Tiempo",
        totalFeatures: "Total Funcionalidades",
        totalScenarios: "Total Escenarios",
        totalModules: "Total Módulos",
        progressPercentage: "Progreso",
        completed: "completadas",
        pending: "pendientes",
        featuresByStatus: "Funcionalidades por Estado",
        featuresByPriority: "Funcionalidades por Prioridad",
        moduleDistribution: "Distribución por Módulo",
        weeklyTrends: "Tendencias Semanales",
        featureCoverage: "Cobertura de Funcionalidades",
        passedScenarios: "Exitosos",
        failedScenarios: "Fallidos",
        coverage: "Cobertura",
        projectsActivity: "Actividad de Proyectos",
        qualityStats: "Estadísticas de Calidad",
        successRate: "Tasa de Éxito",
        mostUsedTags: "Tags Más Utilizados",
        timeRange: "Rango de Tiempo",
        last7Days: "Últimos 7 días",
        last30Days: "Últimos 30 días",
        last90Days: "Últimos 90 días",
        last180Days: "Últimos 180 días",
        downloadReport: "Descargar Reporte",
        reportDownloaded: "Reporte descargado exitosamente",
        errorLoading: "Error al cargar datos de analytics",
        errorDownloading: "Error al descargar reporte",
        noData: "Sin Datos de Analytics",
        noDataDescription: "No hay datos de analytics disponibles para los criterios seleccionados",
        selectProject: "Selecciona un Proyecto",
        selectProjectDescription: "Por favor selecciona un proyecto para ver analytics",
        refresh: "Actualizar"
      },
      // Kanban
      kanban: {
        title: "Tablero Kanban",
        subtitle: "Gestiona el flujo de desarrollo de funcionalidades",
        searchFeatures: "Buscar funcionalidades...",
        allProjects: "Todos los Proyectos",
        noFeatures: "No hay funcionalidades para mostrar",
        createFirst: "Crea tu primera funcionalidad para comenzar",
        adjustFilters: "Intenta ajustar tus filtros de búsqueda",
        dropHere: "Suelta aquí para cambiar estado"
      },
      // Idioma
      language: {
        title: "Idioma",
        english: "Inglés",
        spanish: "Español"
      },
      // Navegación
      navigation: {
        accessRestricted: "Acceso Restringido",
        hierarchicalAccess: "Por favor sigue la navegación jerárquica: Proyectos → Módulos → Funcionalidades → Escenarios",
        featuresAccess: "Para acceder a las funcionalidades, por favor comienza seleccionando un proyecto, luego un módulo.",
        scenariosAccess: "Para acceder a los escenarios, por favor comienza seleccionando un proyecto, luego un módulo, luego una funcionalidad."
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;