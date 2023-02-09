// create an object where each alphabet is a key and the value is a color in hex code like a: amber and b: blue

const colors = {
    'a': 'bg-[#FFC117]',
    'b': 'bg-[#2196F3]',
    'c': 'bg-[#4CAF50]',
    'd': 'bg-[#FF9800]',
    'e': 'bg-[#009688]',
    'f': 'bg-[#9C27B0]',
    'g': 'bg-[#FF6980]',
    'h': 'bg-[#795548]',
    'i': 'bg-[#607D8B]',
    'j': 'bg-[#3F51B5]',
    'k': 'bg-[#00BCD4]',
    'l': 'bg-[#8BC34A]',
    'm': 'bg-[#CDDC39]',
    'n': 'bg-[#FFEB3B]',
    'o': 'bg-[#FFC107]',
    'p': 'bg-[#2196F3]',
    'q': 'bg-[#4CAF50]',
    'r': 'bg-[#FF5722]',
    's': 'bg-[#009688]',
    't': 'bg-[#9C27B0]',
    'u': 'bg-[#FF5722]',
    'v': 'bg-[#795548]',
    'w': 'bg-[#607D8B]',
    'x': 'bg-[#3F51B5]',
    'y': 'bg-[#00BCD4]',
    'z': 'bg-[#8BC34A]'
}

// create a function that takes a string and returns a color
const getColor = (string) => {
    const firstLetter = string[0].toLowerCase()
    return colors[firstLetter]
}

export default getColor