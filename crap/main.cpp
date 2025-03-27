#include <iostream>
#include <math.h>

auto answer() -> int {
    int64_t left;
    int64_t right = 2;
    int64_t counter = 0;
    while (true)
    {
        left = pow(counter, 2) - pow(counter, 3);
        if (left == right)
        {
            return counter;
        }
        counter--;
        
    }
    
}

int calculate(int x) {
    int left1 = pow(2, x);
    int left2 = pow(8, x);
    int left = left1 + left2;
    return left;
}

float calculate(float x) {
    float left1 = powf(2, x);
    float left2 = powf(8, x);
    float left = left1 + left2;
    return left;
}

auto university_answer() -> int {
    int right = 130;
    int x = 0;
    while (true)
    {
        int left = calculate(x);
        if (left == right)
        {
            return x;
        }
        
        x++;
    }
}

auto university_answer_F() -> float {
    float right = 130;
    float x = 0;
    while (true)
    {
        float left = calculate(x);
        if (left == right)
        {
            return x;
        }
        
        x += 0.1;
    }
}


auto university_answer_neg() -> int {
    int right = 130;
    int x = 0;
    while (true)
    {
        int left = calculate(x);
        if (left == right)
        {
            return x;
        }
        
        x++;
    }
}


int main(void) {
    int aa = university_answer_F();
    std::cout << aa << "\n";
}