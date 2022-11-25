#include <iostream>
using namespace std;

const double INITIAL_SUPPLY = 10000.0;     // 10k token
const double INITIAL_PRICE = 5.0;     // 1 token = 5$

double stablecoin = 0;
double marketcap = INITIAL_SUPPLY * INITIAL_PRICE;
double supply = INITIAL_SUPPLY;
double price = INITIAL_PRICE;

void output(){
    cout << "Token supply: " << supply << endl;
    cout << "Token price: " << price << endl;
    cout << "Marketcap: " << marketcap << endl;
    cout << "Stablecoin supply: " << stablecoin << endl;
    cout << "Stablecoin price: " << 1 << endl << endl;
}

bool burnToken(int quantity){
    if(quantity >= supply) return false;
    supply -= quantity;
    stablecoin += quantity * price;
    price *= (quantity/supply + 1);
    marketcap = supply * price;
    return true;
}

bool burnStableCoin(int quantity){
    if(quantity <= 0) return false;
    supply += quantity;

    return true;
}

int main() {
    output();
    burnToken(1000);
    output();
    return 0;
}
