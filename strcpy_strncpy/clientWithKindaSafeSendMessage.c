/* clientWithKindaSafeSendMessage.c */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int sendMessage(char * recipientsName, char * message) {

	/*  Sends message to the recipient. 
	 *  Returns the number of characters that was sent successfully. 
	 *  If there was an error, return a negative number
	 *
	 *  */

	if (recipientsName == NULL || message == NULL ) {
		printf("Hmm, when sending a message, please include both \n");
	       	printf("the receivers name and the content of the message\n");
		return -1; 
	}

	
	printf("Sending a message. \n");
	printf("Recipient's Name : %s\n", recipientsName);
	printf("Message content : %s\n", message);
	return strlen(message);
}

int main( int argc, char *argv[] ){


	printf("Name of current program running : %s\n", argv[0]);
	printf("Number of command line arugments given : %d\n", argc-1);

	char friendsName[8];
	char message[20];
	int charsSent = 0;
	int i = 0;
	if ( argc == 3 ) {
		/* First copy first 7 characters of recipients name			
		 */
		for (i=0; i < 7; i++ )
			friendsName[i]  = argv[1][i] ;
		
		/* Then null terminate it with te end of string character. */ 
		friendsName[7] = '\0';
	
		/* Also copy first 19 characters or the message */
		for (i = 0 ; i < 19 ; i++ )
			message[i] = argv[2][i] ;
		
		/* Also then terminate the message with a the null characer */
		message[19] = '\0';

		/* Now send the message */
		charsSent = sendMessage(friendsName, message);

		/* Tell how many characters was successfully sent */
		if ( charsSent < 0 )
			printf("There was an error during the sending of the text \n");
		else if ( charsSent == 0)
			printf(" No characters were sent \n");
		else
			printf("%d characters were sent successfully \n", charsSent);
	}

return EXIT_SUCCESS;


}






