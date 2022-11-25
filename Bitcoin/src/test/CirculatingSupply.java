package test;

public class CirculatingSupply {
    public static void main(String[] args) {
        float c = 0;
        int anno;
        for(int i = 0; i < 33; i++){
            c += (float) 210000 * (50 / Math.pow(2, i));
            anno = 2008 + (4 * i);
            System.out.println("Year: " + anno);
            System.out.println("Epoch: " + i);
            System.out.println("Block mined: " + c);
            System.out.println();
        }
    }
}
