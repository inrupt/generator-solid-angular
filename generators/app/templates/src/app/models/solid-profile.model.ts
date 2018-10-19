/**
 * A Solid Profile Card object
 * @see FOAF
 * @see VCARD
 */
export interface SolidProfile {
    address: {
        street?: string;
        // TODO: Add the missing address fields
    };
    company: string;
    email: string;
    fn: string;
    image: string;
    phone: string;
    role: string;
    organization?: string;
}
