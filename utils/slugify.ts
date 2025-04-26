import slugify from 'slugify'

export function generateSlug(title: string): string {
    return slugify(title, {
        lower: true, // convert to lower case
        strict: true, // strip special characters except replacement
        trim: true, // trim leading and trailing replacement chars
        locale: 'vi', // language for replacement
    })
}
export function verifySlug(url: string) {
    return url.split('__')[1]
}

export function getUniqueSlug(title: string, existingSlugs: string[]): string {
    const slug = generateSlug(title)
    let uniqueSlug = slug
    let counter = 1

    while (existingSlugs.includes(uniqueSlug)) {
        uniqueSlug = `${slug}-${counter}`
        counter++
    }

    return uniqueSlug
}
