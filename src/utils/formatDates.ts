

export const formatLongDate = (dateString?: string, language?: "EN" | "ES"): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);

    // Verificar que la fecha sea válida
    if (isNaN(date.getTime())) {
      return "";
    }

    // Determinar el locale basado en el idioma
    const locale = language === "EN" ? "en-US" : "es-ES";

    // Opciones para formato largo
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    return date.toLocaleDateString(locale, options);
  } catch (error) {
    console.error("Error al formatear la fecha:", error);
    return "";
  }
};

