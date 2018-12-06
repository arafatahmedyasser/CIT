/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 */

package com.intellectdesign.canvas.servercomm.encryption;

import java.io.IOException;
import java.security.Key;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Container class for facilitation public key sharing functions , It needs a publickey interface implementation to do
 * all the operations
 * 
 * @version 1.0
 */
public class PublicKeyContainer
{

	private PublicKeyInterface publicKey = null;
	private Object key = null;

	/**
	 * Constructor needs request object and a publicKey interface implementation , so that the container can delicate
	 * the necessary operations to the implementation
	 * 
	 * @param request
	 * @param pubKeyImpl
	 */

	public PublicKeyContainer(HttpServletRequest request, PublicKeyInterface pubKeyImpl)
	{

		this.publicKey = pubKeyImpl;
		setPublicKeyInRequest(request);
	}

	/**
	 * This method will generate the public key and store it in the session storage
	 * 
	 * @param request
	 */

	private void setPublicKeyInRequest(HttpServletRequest request)
	{

		Object rsa = request.getSession().getServletContext().getAttribute("PUB_KEY");

		if (rsa == null)
		{

			rsa = generateKey(request);
			request.getSession().getServletContext().setAttribute("PUB_KEY", rsa);
		}
		this.key = rsa;
	}

	/**
	 * This method will call the implementation to generate the public key object
	 * 
	 * @param request
	 * @return
	 */

	private Object generateKey(HttpServletRequest request)
	{

		return this.publicKey.generatePublicKey();
	}

	/**
	 * This method will print the public key to the server response , this method is delicated to the implementation
	 * class
	 * 
	 * @param request
	 * @param response
	 * @throws IOException
	 */

	public void printPublicKey(HttpServletRequest request, HttpServletResponse response) throws IOException
	{

		this.publicKey.printPublicKey(this.key, response);
	}

	/**
	 * This method will return the public key string
	 * 
	 * @param request
	 * @return String
	 */

	public String getPublicKeyString(HttpServletRequest request)
	{

		if (this.key == null)
		{
			setPublicKeyInRequest(request);
		}
		return this.publicKey.getPublicKeyString(this.key);
	}

	/**
	 * This method will return the Key object of the public key
	 * 
	 * @param request
	 * @return Key
	 */

	public Key getPublicKey(HttpServletRequest request)
	{

		if (this.key == null)
		{
			setPublicKeyInRequest(request);
		}
		return this.publicKey.getPublicKey(this.key);
	}

	/**
	 * This method will return the encrypted cipher text of the data provided
	 * 
	 * @param data
	 * @return byte[]
	 */

	public byte[] encrypt(String data)
	{

		return this.publicKey.encrypt(data, this.key);
	}

	/**
	 * This method will return the decrypted plain text of the cipher text
	 * 
	 * @param cipherText
	 */

	public String decrypt(byte[] cipherText)
	{

		return this.publicKey.decrypt(cipherText, this.key);

	}

}
