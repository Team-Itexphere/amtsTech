const formatDate = (date: Date | string, format: string = 'MM/DD/YYYY'): string => {
    try {
        const parsedDate = new Date(date);
        const dd = String(parsedDate.getDate()).padStart(2, '0');
        const mm = String(parsedDate.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = parsedDate.getFullYear();

        switch (format) {
            case 'MM/DD/YYYY':
                return `${mm}/${dd}/${yyyy}`;
            case 'DD/MM/YYYY':
                return `${dd}/${mm}/${yyyy}`;
            default:
                return `${mm}/${dd}/${yyyy}`;
        }
    } catch (ex) {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = today.getFullYear();

        switch (format) {
            case 'MM/DD/YYYY':
                return `${mm}/${dd}/${yyyy}`;
            case 'DD/MM/YYYY':
                return `${dd}/${mm}/${yyyy}`;
            default:
                return `${mm}/${dd}/${yyyy}`;
        }
    }
};

const formatDateWithHyphen = (date: Date | string, format: string = 'MM-DD-YYYY'): string => {
    try {
        const parsedDate = new Date(date);
        const dd = String(parsedDate.getDate()).padStart(2, '0');
        const mm = String(parsedDate.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = parsedDate.getFullYear();

        switch (format) {
            case 'MM-DD-YYYY':
                return `${mm}-${dd}-${yyyy}`;
            case 'DD-MM-YYYY':
                return `${dd}-${mm}-${yyyy}`;
            default:
                return `${mm}-${dd}-${yyyy}`;
        }
    } catch (ex) {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = today.getFullYear();

        switch (format) {
            case 'MM-DD-YYYY':
                return `${mm}-${dd}-${yyyy}`;
            case 'DD-MM-YYYY':
                return `${dd}-${mm}-${yyyy}`;
            default:
                return `${mm}-${dd}-${yyyy}`;
        }
    }
};

const formatDateWithMonthName = (date: Date | string, format: string = 'DD-Month-YYYY'): string => {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const parsedDate = new Date(date);
    const dd = String(parsedDate.getDate()).padStart(2, '0');
    const mm = monthNames[parsedDate.getMonth()];
    const yyyy = parsedDate.getFullYear();

    switch (format) {
        case 'DD-Month-YYYY':
            return `${dd}-${mm}-${yyyy}`;
        default:
            return `${dd}-${mm}-${yyyy}`;
    }
};

const formatDateWithFullDesign = (date: Date | string, format: string = 'DD Month YYYY'): string => {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const parsedDate = new Date(date);
    const dd = String(parsedDate.getDate()).padStart(2, '0');
    const mm = monthNames[parsedDate.getMonth()];
    const yyyy = parsedDate.getFullYear();

    switch (format) {
        case 'DD Month YYYY':
            return `${dd} ${mm} ${yyyy}`;
        default:
            return `${dd} ${mm} ${yyyy}`;
    }
};

const formatDateWithShortMonth = (date: Date | string, format: string = 'DD Mon YYYY'): string => {
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const parsedDate = new Date(date);
    const dd = String(parsedDate.getDate()).padStart(2, '0');
    const mm = monthNames[parsedDate.getMonth()];
    const yyyy = parsedDate.getFullYear();

    switch (format) {
        case 'DD Mon YYYY':
            return `${dd} ${mm} ${yyyy}`;
        default:
            return `${dd} ${mm} ${yyyy}`;
    }
};

const formatDateWithShortMonthHyphen = (date: Date | string, format: string = 'DD-Mon-YYYY'): string => {
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const parsedDate = new Date(date);
    const dd = String(parsedDate.getDate()).padStart(2, '0');
    const mm = monthNames[parsedDate.getMonth()];
    const yyyy = parsedDate.getFullYear();

    switch (format) {
        case 'DD-Mon-YYYY':
            return `${dd}-${mm}-${yyyy}`;
        default:
            return `${dd}-${mm}-${yyyy}`;
    }
};

const formatDateUS = (date: Date | string, format: string = 'MM-DD-YYYY'): string => {
    try {
        const parsedDate = new Date(date);
        const dd = String(parsedDate.getUTCDate()).padStart(2, '0');
        const mm = String(parsedDate.getUTCMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = parsedDate.getUTCFullYear();

        switch (format) {
            case 'MM-DD-YYYY':
                return `${mm}/${dd}/${yyyy}`;
            case 'DD-MM-YYYY':
                return `${dd}/${mm}/${yyyy}`;
            default:
                return `${mm}/${dd}/${yyyy}`;
        }
    } catch (ex) {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const yyyy = today.getFullYear();

        switch (format) {
            case 'MM-DD-YYYY':
                return `${mm}/${dd}/${yyyy}`;
            case 'DD-MM-YYYY':
                return `${dd}/${mm}/${yyyy}`;
            default:
                return `${mm}/${dd}/${yyyy}`;
        }
    }
};

export {
    formatDate,
    formatDateWithHyphen,    
    formatDateWithMonthName,
    formatDateWithFullDesign,
    formatDateWithShortMonth,
    formatDateWithShortMonthHyphen,
    formatDateUS
};
