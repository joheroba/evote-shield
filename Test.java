import org.jmrtd.BACKey;
import org.jmrtd.BACKeySpec;
public class Test {
    public static void main(String[] args) {
        System.out.println("BACKey isInterface: " + BACKey.class.isInterface());
        System.out.println("BACKeySpec isInterface: " + BACKeySpec.class.isInterface());
        for(java.lang.reflect.Constructor c : BACKey.class.getConstructors()) {
            System.out.println("BACKey Constructor: " + c);
        }
        for(java.lang.reflect.Constructor c : BACKeySpec.class.getConstructors()) {
            System.out.println("BACKeySpec Constructor: " + c);
        }
    }
}
