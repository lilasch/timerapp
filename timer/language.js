// Translations dictionary
const translations = {
    en: {
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      timerTitle: "20/20/20 Vision Timer",
      timeRemaining: "Time Remaining",
      notificationSettings: "Notification Settings",
      loudOn: "Loud Notifications On",
      quietOn: "Quiet Notifications On",
      about: "About 20/20/20 Rule",
      permissionWarning: "Please enable notifications to receive break reminders",
      setDuration: "Set Timer Duration:",
      enterSeconds: "Enter Seconds",
      close: "Close",
      ruleTitle: "The 20/20/20 Rule",
      ruleDescription: "The 20/20/20 rule is a simple guideline to reduce eye strain caused by looking at digital screens for extended periods:",
      ruleStep1: "• Every 20 minutes",
      ruleStep2: "• Look at something 20 feet away",
      ruleStep3: "• For at least 20 seconds",
      ruleFooter: "This practice helps relax the eye muscles and reduces the risk of computer vision syndrome and digital eye strain.",
      set: "Set",
      theme_forest: "Forest",
      theme_light_classic: "Light Classic",
      theme_ocean: "Ocean",
      theme_lavender_light: "Lavender Light",
      theme_night_mode: "Night Mode",
      chooseTheme: "Choose Theme:",
      settings: "Settings",
      changeLanguage: "Change Language",
      chooseLanguage: "Select Language",
      reminderTitle: "Reminder",
      noisyReminderTitle: "Noisy Reminder",
      lookAway: "Look away!",
      goodToGo: "You're good to go!",
      unsupportedBrowser: "This browser does not support desktop notifications.",
      minutes: "minutes",
      seconds: "seconds",
      completed: "completed"
    },
    es: {
      start: "Iniciar",
      pause: "Pausa",
      reset: "Reiniciar",
      timerTitle: "Temporizador 20/20/20",
      timeRemaining: "Tiempo Restante",
      notificationSettings: "Configuración de Notificaciones",
      loudOn: "Notificaciones Fuertes Activadas",
      quietOn: "Notificaciones Suaves Activadas",
      about: "Acerca de la Regla 20/20/20",
      permissionWarning: "Por favor, habilite las notificaciones para recibir recordatorios de descanso",
      setDuration: "Establecer duración del temporizador:",
      enterSeconds: "Ingrese segundos",
      close: "Cerrar",
      ruleTitle: "La regla 20/20/20",
      ruleDescription: "La regla 20/20/20 es una guía simple para reducir la fatiga ocular causada por mirar pantallas digitales durante períodos prolongados:",
      ruleStep1: "• Cada 20 minutos",
      ruleStep2: "• Mire algo a 20 pies de distancia",
      ruleStep3: "• Durante al menos 20 segundos",
      set: "Establecer",
      ruleFooter: "Esta práctica ayuda a relajar los músculos oculares y reduce el riesgo de síndrome visual por computadora y fatiga ocular digital.",
      theme_forest: "Bosque",
      theme_light_classic: "Clásico Claro",
      theme_ocean: "Océano",
      theme_lavender_light: "Lavanda Claro",
      theme_night_mode: "Modo Nocturno",
      chooseTheme: "Elija Tema:",
      settings: "Configuraciones",
      changeLanguage: "Cambiar Idioma",
      chooseLanguage: "Seleccionar Idioma",
      reminderTitle: "Recordatorio",
      noisyReminderTitle: "Recordatorio Ruidoso",
      lookAway: "¡Mira hacia otro lado!",
      goodToGo: "¡Estás listo para continuar!",
      unsupportedBrowser: "Este navegador no admite notificaciones de escritorio.",
      minutes: "minutos",
      seconds: "segundos",
      completed: "completado"
    },
    zh: {
      start: "开始",
      pause: "暂停",
      reset: "重置",
      timerTitle: "20/20/20 计时器",
      timeRemaining: "剩余时间",
      notificationSettings: "通知设置",
      loudOn: "开启声音通知",
      quietOn: "关闭声音通知",
      about: "关于 20/20/20 规则",
      permissionWarning: "请启用通知以接收休息提醒",
      setDuration: "设置计时器时长:",
      enterSeconds: "输入秒数",
      close: "关闭",
      ruleTitle: "20/20/20 规则",
      ruleDescription: "20/20/20 规则是一个简单的指南，可以减少长时间看数字屏幕引起的眼睛疲劳:",
      ruleStep1: "• 每 20 分钟",
      ruleStep2: "• 看向 20 英尺外的物体",
      ruleStep3: "• 至少 20 秒",
      ruleFooter: "此方法有助于放松眼部肌肉，降低计算机视觉综合症和数字眼疲劳的风险。",
      set: "设置",
      theme_forest: "森林",
      theme_light_classic: "经典浅色",
      theme_ocean: "海洋",
      theme_lavender_light: "薰衣草浅色",
      theme_night_mode: "夜间模式",
      chooseTheme: "选择主题:",
      settings: "设置",
      changeLanguage: "更改语言",
      chooseLanguage: "选择语言",
      reminderTitle: "提醒",
      noisyReminderTitle: "声音提醒",
      lookAway: "请看远处！",
      goodToGo: "你可以继续了！",
      unsupportedBrowser: "此浏览器不支持桌面通知。",
      minutes: "分钟",
      seconds: "秒",
      completed: "完成"
    }
  };
  
  // Function to get translation based on key and language
  export function getTranslation(language, key) {
    return translations[language]?.[key] || translations['en'][key] || key;
  }
  
  // Function to get all available languages
  export function getAvailableLanguages() {
    return Object.keys(translations);
  }
  