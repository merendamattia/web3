package test;

public class BlockReward {
    public static void main(String[] args) {
        Double rew = (double) 50;
        Double supply = (double) 0;
        int year = 2008;
        int blockHeight = 210000;
        String str = "";

        for(int i = 0; i < 33; i++){

            supply += (float) 210000 * (50 / Math.pow(2, i));
            int b = blockHeight * i;
            str = "Block Height: " + b;

            if(i == 0) str += "\nHalving: Genesis";
            else str += "\nHalving: " + i;

            str += "\nReward: " + rew.toString();
            str += "\nCirculating Supply: " + supply;
            str += "\nYear: " + year;
            str += "\n";
            System.out.println(str);

            rew /= 2;
            year += 4;
        }
    }
}
