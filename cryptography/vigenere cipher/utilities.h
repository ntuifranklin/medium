#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <ctype.h>
#include <limits.h>

#include "cipher_constants.h"

char * generateSameSizeKey(char * key, ushort keySize, ushort plainTextSize) {

    /* Dynamically allocating memory because this string will be returned from this function */
    char * sameSizeKey = (char *) malloc((plainTextSize + 1) * sizeof(char)) ;

    if (sameSizeKey == NULL )
     return "\0";

    ushort ssk, k ; //ssk = sameSiseKey

    /* Generate a key of the same size as the plain text  */
    for (ssk=0, k=0; ssk < plainTextSize ; k++, ssk++) {
        /* if we have used all the characters in the given key, 
        repeat with characters at beginning of the key */
        if ( k == keySize )
            k= 0;
        sameSizeKey[ssk] = key[k] ;
    } ;
    sameSizeKey[ssk] = '\0';
    return sameSizeKey ;
}

ushort position(char c) {
    ushort k ;
    for (k = 0 ; k < CRYPTABET_SIZE; k++ )
        if (CRYPTABET[k] == c)
            return k ;

    return -1;

}
char * encrypt(char * key, ushort keySize, char * plainText, ushort plainTextSize ) {
    /* 
    Start by generating a key of the same size as that of the plain text 
    A plain text could be longer than the key.
    In which case we repeat the key several times
    */
    
    char * sameSizeKey = generateSameSizeKey(key, keySize, plainTextSize);

    /* Dynamically allocating memory because this string will be returned from this function */
    char * encryptedText = (char *) malloc ((plainTextSize + 1) * sizeof(char));
    ushort k ; //ssk = sameSiseKey

    /* Now perform the encryption */
    for (k=0 ; k < plainTextSize ; k++ ) {
        encryptedText[k] = CRYPTABET[( plainText[k] + sameSizeKey[k] ) % CRYPTABET_SIZE];
    }

    /* always terminate with end of string character */
    encryptedText[k] = '\0';
    return encryptedText ;

}


char * decrypt(char * sameSizeKey, ushort keySize, char * cipherText, ushort cipherTextSize ) {
    /* 
    Start by generating a key of the same size as that of the plain text 
    A plain text could be longer than the key.
    In which case we repeat the key several times
    */
    

    /* Dynamically allocating memory because this string will be returned from this function */
    char * plainText = (char *) malloc ((cipherTextSize + 1) * sizeof(char));
    ushort  k;


    /* Now perform the decryption */
    for (k=0 ; k < cipherTextSize ; k++ ) {

        
        plainText[k] = CRYPTABET[(( cipherText[k] - sameSizeKey[k])  + CRYPTABET_SIZE ) % CRYPTABET_SIZE];
        

    }
    /* always terminate with end of string character */
    plainText[k] = '\0';

    return plainText ;


}
