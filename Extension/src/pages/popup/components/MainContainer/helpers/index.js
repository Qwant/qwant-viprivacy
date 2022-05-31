export const isWebURL = (url) => {
    if (!url) return false;
    const regex = new RegExp(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/);
    return regex.test(url);
};

export const formatAnnoyanceTime = (totalBlocked) => {
    const millisecondsPerItem = 50;
    const estimatedMillisecondsSaved = totalBlocked * millisecondsPerItem || 0;
    const hours = estimatedMillisecondsSaved < 1000 * 60 * 60 * 24;
    const minutes = estimatedMillisecondsSaved < 1000 * 60 * 60;
    const seconds = estimatedMillisecondsSaved < 1000 * 60;

    let counter;
    let text;

    if (seconds) {
        counter = Math.ceil(estimatedMillisecondsSaved / 1000);
        text = 's';
    } else if (minutes) {
        counter = Math.ceil(estimatedMillisecondsSaved / 1000 / 60);
        text = 'min';
    } else if (hours) {
        counter = +((estimatedMillisecondsSaved / 1000 / 60 / 60).toFixed(1));
        text = 'h';
    } else {
        counter = +((estimatedMillisecondsSaved / 1000 / 60 / 60 / 24).toFixed(2)) * 24;
        text = 'h';
    }

    return `${Math.ceil(counter)} ${text}`;
};

export const formatCounter = (number = 0) => {
    return new Intl.NumberFormat('fr', {
        style: 'decimal',
        notation: 'compact',
        compactDisplay: 'short',
    }).format(number);
};
