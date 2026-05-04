package com.innovacion.nfc_dni;

import org.jmrtd.BACKey;
import org.jmrtd.PassportService;
import android.nfc.Tag;
import android.nfc.tech.IsoDep;
import net.sf.scuba.smartcards.CardService;

public class JmrtdHelper {
    public static void doBAC(Tag tag, String dni, String dob, String doe) throws Exception {
        IsoDep isoDep = IsoDep.get(tag);
        isoDep.setTimeout(5000);
        CardService cardService = CardService.getInstance(isoDep);
        PassportService service = new PassportService(cardService, 256, 224, false, false);
        service.open();
        service.sendSelectApplet(false);
        BACKey bacKey = new BACKey(dni, dob, doe);
        service.doBAC(bacKey);
    }
}
