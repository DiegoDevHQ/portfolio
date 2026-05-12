#include <algorithm>
#include <cctype>
#include <iostream>
#include <set>
#include <string>

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cout << 50;
        return 0;
    }

    std::string input = argv[1];

    int length_bonus = std::min(30, static_cast<int>(input.size() / 4));
    std::set<char> unique_chars;

    int vowel_count = 0;
    int digit_count = 0;

    for (char c : input) {
        char lower = static_cast<char>(std::tolower(static_cast<unsigned char>(c)));
        unique_chars.insert(lower);
        if (lower == 'a' || lower == 'e' || lower == 'i' || lower == 'o' || lower == 'u') {
            vowel_count++;
        }
        if (std::isdigit(static_cast<unsigned char>(c))) {
            digit_count++;
        }
    }

    int novelty_bonus = std::min(30, static_cast<int>(unique_chars.size()));
    int composition_bonus = std::min(20, vowel_count / 2 + digit_count * 2);

    int score = 20 + length_bonus + novelty_bonus + composition_bonus;
    score = std::max(1, std::min(100, score));

    std::cout << score;
    return 0;
}
