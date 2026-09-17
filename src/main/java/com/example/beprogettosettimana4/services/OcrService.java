package com.example.beprogettosettimana4.services;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class OcrService {

    private final Tesseract tesseract;

    public OcrService(
            @Value("${tesseract.datapath}") String datapath,
            @Value("${tesseract.language}") String language) {

        this.tesseract = new Tesseract();
        this.tesseract.setDatapath(datapath);
        this.tesseract.setLanguage(language);
    }

    public String extractText(File imageFile) {

        try {
            return tesseract.doOCR(imageFile).trim();

        } catch (TesseractException e) {
            throw new RuntimeException("Impossibile estrarre il testo dal documento", e);
        }
    }
}
