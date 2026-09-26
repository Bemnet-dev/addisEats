export function validateCheckoutForm(values) {
    const errors = {};
    if (!values.name || values.name.trim().length < 2) {
        errors.name = 'Full name must be at least 2 characters.';
    }
    const sanitizedPhone = values.phone.replace(/[\s-]/g, '');
    const ethiopianPhoneRegex = /^(\+251[79]\d{8}|0[79]\d{8})$/;
    if (!values.phone || !values.phone.trim()) {
        errors.phone = 'Phone number is required for delivery contact.';
    }
    else if (!ethiopianPhoneRegex.test(sanitizedPhone) && sanitizedPhone.length < 9) {
        errors.phone = 'Please enter a valid Ethiopian phone number (e.g. 0911234567 or +251 91 123 4567).';
    }
    if (!values.area || !values.area.trim()) {
        errors.area = 'Please select a delivery subcity in Addis Ababa.';
    }
    if (!values.address || values.address.trim().length < 3) {
        errors.address = 'Specific landmark, building, or street is required.';
    }
    return errors;
}
