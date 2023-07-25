#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int send_message(char* recipientsName, char * message) {

	/*  Sends message to the recipient. 
	 *  Returns the number of characters that was sent successfully. 
	 *  If there was an error, return a negative number
	 *
	 *  */

	if (recipientsName != NULL && message != NULL )
		return strlen(message);
	else
		return -1;

}

int main( int argc, char *argv[] ){


	printf("Name of current program running : %s\n", argv[0]);
	printf("Number of command line arugments given : %d\n", argc-1);

	char friendsName[8];
	char message[31];

	if ( argc == 3 ) {
		/* send the message and tell us how much characters
		 * was transferred to my friend 			
		 * 
		 */
		strcpy(friendsName,argv[1]);
		strcpy(message, argv[2]);
		/* send the message */
		printf("%s\n",friendsName);
		printf("%s\n",message);
	}

return EXIT_SUCCESS;


}






