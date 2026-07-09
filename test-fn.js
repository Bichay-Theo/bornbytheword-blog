const str = `This is a test [1] and another [٢].

[1] This is the first footnote.
[٢] This is the second.`;

// Convert eastern arabic numerals to western for footnote markers
let result = str.replace(/\[([١٢٣٤٥٦٧٨٩٠0-9]+)\]/g, (match, num) => {
    // convert arabic to english
    let engNum = num.replace(/[١٢٣٤٥٦٧٨٩٠]/g, d => '١٢٣٤٥٦٧٨٩٠'.indexOf(d) + 1);
    return `[^${engNum}]`;
});

// Now we need to append ":" for definitions
result = result.replace(/^\[\^([0-9]+)\]\s*/gm, '[^$1]: ');

console.log(result);
