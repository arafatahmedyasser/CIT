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
import java.io.PrintWriter;
import java.security.Key;

import javax.crypto.Cipher;
import javax.servlet.http.HttpServletResponse;

import org.bouncycastle.jce.provider.BouncyCastleProvider;

import com.intellectdesign.canvas.logger.Logger;

/**
 * Implementation of the PublicKeyInterface to facilitate key exchanging process
 * 
 * @version 1.0
 */
public class PublicKeyImpl implements PublicKeyInterface
{
	/**
	 * Default Constructor
	 */
	public PublicKeyImpl()
	{
		// registering the Bouncy castle as the security provider
		java.security.Security.addProvider(new BouncyCastleProvider());
	}

	/**
	 * The public key object is extracted from the object provided
	 * 
	 * @param keyObj
	 * @return String
	 * @see com.intellectdesign.canvas.servercomm.encryption.PublicKeyInterface#getPublicKeyString(java.lang.Object)
	 */
	@Override
	public String getPublicKeyString(Object keyObj)
	{
		/**
		 * @keyObj - public key instance Mehtod to get the public Key string data from the key object, The public key
		 *         object is extracted from the object provided
		 */
		RSAInstance key = (RSAInstance) keyObj;
		return new String(key.getPublicKey().getEncoded());
	}

	/**
	 * public key instance Method to retrive the Public Key object form "Key Object" the key object is stored by the
	 * controller
	 * 
	 * @param keyObj
	 * @return Key
	 * @see com.intellectdesign.canvas.servercomm.encryption.PublicKeyInterface#getPublicKey(java.lang.Object)
	 */
	@Override
	public Key getPublicKey(Object keyObj)
	{
		/**
		 * @keyObj - public key instance Method to retrive the Public Key object form "Key Object" the key object is
		 *         stored by the controller
		 */

		RSAInstance key = (RSAInstance) keyObj;
		return key.getPublicKey();
	}

	/**
	 * Prints the contents Method to print the public key component to the client , this will get the key data from the
	 * key Object
	 * 
	 * @param keyObj
	 * @param response
	 * @throws IOException
	 * @see com.intellectdesign.canvas.servercomm.encryption.PublicKeyInterface#printPublicKey(java.lang.Object,
	 *      javax.servlet.http.HttpServletResponse)
	 */
	@Override
	public void printPublicKey(Object keyObj, HttpServletResponse response) throws IOException
	{

		/**
		 * @keyObj - public key instance
		 * 
		 * @reponse - servlet reponse object , need to print the contents Method to print the public key component to
		 *          the client , this will get the key data from the key Object
		 */
		RSAInstance keys = (RSAInstance) keyObj;

		String e = String.valueOf(keys.getPublicExponent());
		String n = String.valueOf(keys.getKeyModulus());
		/** Sends response **/
		PrintWriter out = response.getWriter();
		out.print("{\"e\":\"" + e + "\",\"n\":\"" + n + "\"}");
		out.close();
		return;

	}

	/**
	 * Method to generate a new Public Key instance , for this implementation we used RSA
	 * 
	 * @return RSAInstance Object
	 * @see com.intellectdesign.canvas.servercomm.encryption.PublicKeyInterface#generatePublicKey()
	 */
	@Override
	public Object generatePublicKey()
	{
		/**
		 * Method to generate a new Public Key instance , for this implementation we used RSA
		 */

		RSAInstance rsa = RSAInstance.INSTANCE;
		return rsa;
	}

	/**
	 * get an RSA cipher object and print the provider then encrypt the plain text using the public key
	 * 
	 * @param data
	 * @param keyObj
	 * @return byte[]
	 * @see com.intellectdesign.canvas.servercomm.encryption.PublicKeyInterface#encrypt(java.lang.String, java.lang.Object)
	 */
	@Override
	public byte[] encrypt(String data, Object keyObj)
	{
		/**
		 * @data - String value of the plain text to be encrypted
		 * 
		 * @keyObj - public key instance Method to encrypt the data with the public key
		 */

		Key key = ((RSAInstance) keyObj).getKeyPair().getPublic();
		byte[] cipherText = null;
		try
		{
			// get an RSA cipher object and print the provider
			final Cipher cipher = Cipher.getInstance("RSA/None/PKCS1Padding", "BC");
			// encrypt the plain text using the public key
			cipher.init(Cipher.ENCRYPT_MODE, key);
			cipherText = cipher.doFinal(data.getBytes());
		} catch (Exception e)
		{
			logger.cterror("CTRND00411", e);
		}
		return cipherText;

	}

	/**
	 * get an RSA cipher object and print the provider then decrypt the text using the private key
	 * 
	 * @param cipherText
	 * @param keyObj
	 * @return String
	 * @see com.intellectdesign.canvas.servercomm.encryption.PublicKeyInterface#decrypt(byte[], java.lang.Object)
	 */
	@Override
	public String decrypt(byte[] cipherText, Object keyObj)
	{
		/**
		 * @cipherText - byte array of the encrypted data
		 * 
		 * @keyObj-publi key instance Method to decrypt the data ecnrypted with the public key
		 */
		Key key = ((RSAInstance) keyObj).getKeyPair().getPrivate();
		byte[] decryptedText = null;
		try
		{
			// get an RSA cipher object and print the provider
			final Cipher cipher = Cipher.getInstance("RSA/None/PKCS1Padding", "BC");

			// decrypt the text using the private key
			cipher.init(Cipher.DECRYPT_MODE, key);
			decryptedText = cipher.doFinal(cipherText);

		} catch (Exception ex)
		{
			logger.cterror("CTRND00412", ex);
		}

		return new String(decryptedText);

	}

	private static final Logger logger = Logger.getLogger(PublicKeyImpl.class);
}
