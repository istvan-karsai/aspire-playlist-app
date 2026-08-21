export const ValidationRegex = {
    DurationFormat: /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/
} as const;

export const FormatConstants = {
    ZeroDuration: "00:00:00"
} as const;