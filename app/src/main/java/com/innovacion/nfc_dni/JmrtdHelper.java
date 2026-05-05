package com.innovacion.nfc_dni;

import org.jmrtd.BACKey;
import org.jmrtd.PassportService;
import android.nfc.Tag;
import android.nfc.tech.IsoDep;
import net.sf.scuba.smartcards.CardService;

import java.security.Security;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

public class JmrtdHelper {
    static {
        Security.removeProvider("BC");
        Security.addProvider(new BouncyCastleProvider());
    }

    public static void doBAC(Tag tag, String dni, String dob, String doe) throws Exception {
        IsoDep isoDep = IsoDep.get(tag);
        isoDep.setTimeout(10000); // Aumentamos timeout para chips lentos
        if (!isoDep.isConnected()) isoDep.connect();
        
        CardService cardService = CardService.getInstance(isoDep);
        PassportService service = new PassportService(cardService, 256, 224, false, false);
        service.open();
        
        BACKey bacKey = new BACKey(dni, dob, doe);
        service.doBAC(bacKey);
    }
}
