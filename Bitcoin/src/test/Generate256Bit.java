package test;
import java.util.concurrent.ThreadLocalRandom;

public class Generate256Bit {
    /**
     * DIM = numeri bit
     */
    public static int DIM = 256;

    /**
     * Ritorna true o false casualmente
     * @return
     */
    public static boolean generate0or1(){
        return ThreadLocalRandom.current().nextBoolean();
    }
    /**
     * Richiama DIM volte la funzione generate0or1()
     * @return array di boolean contenente DIM elementi
     */
    public static Boolean[] generate256bit(){
        Boolean[] vet = new Boolean[DIM];
        for(int i = 0; i < DIM; i++)
            vet[i] = generate0or1();
        return vet;
    }
    /**
     * toString() dell'array di boolean
     * @param vet array di boolean
     * @return
     */
    public static String print(Boolean[] vet){
        String str = "";
        int c0, c1;
        c0 = c1 = 0;

        for(int i = 0; i < DIM; i++){
            if(vet[i]){
                str += "1";
                c1++;
            }
            else{
                str += "0";
                c0++;
            }
        }

        System.out.println("0 count: " + c0);
        System.out.println("1 count: " + c1);

        return str;
    }

    public static void main(String[] args) {
        Boolean[] vet = generate256bit();
        System.out.print(print(vet));
    }
}
