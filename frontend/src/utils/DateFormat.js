export const formatDate = (dateInput) => {
    const dateObj = new Date(dateInput)

    return dateObj.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

export const formatTime = (dateInput) => {
    const dateObj = new Date(dateInput)

    return dateObj.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    })
}

export const TimeReform = (dateInput) => {
    const createdTime = new Date(dateInput)
    const timeNow = new Date()

    const difference = Math.floor((timeNow - createdTime) / 1000)
    const minutes = Math.floor(difference / 60)
    const hours = Math.floor(difference / 3600)

    if (minutes < 1) return "now"
    if (minutes < 60) return `${minutes} minutes ago`
    return `${hours} hours ago`
}