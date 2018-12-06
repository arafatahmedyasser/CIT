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
 * 
 */
package com.intellectdesign.canvas.servercomm.encryption;

import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.SecretKeySpec;
import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.binary.Hex;

import com.intellectdesign.canvas.logger.Logger;

/**
 * Util class for facilitating encoding ,decoding and conversions
 * 
 * @version 1.0
 */
public class EncryptionUtils
{

	/**
	 * @keyBytes - byte array of the key string This method returns a Key object from the byte array of keystring
	 * 
	 * @param keyBytes
	 * @return SecretKeySpec
	 */
	public static SecretKeySpec getAESKeyFromBytes(byte[] keyBytes)
	{

		SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, "AES");
		return secretKeySpec;
	}

	/**
	 * @aesKey - String representation of the aes key This method returns a Key object from "hex" keystring
	 * @param aesKey
	 * @return SecretKeySpec
	 * @throws DecoderException
	 */
	public static SecretKeySpec getAESKeyFromHexString(String aesKey) throws DecoderException
	{

		byte[] keyBytes = Hex.decodeHex(aesKey.toCharArray());
		return getAESKeyFromBytes(keyBytes);
	}

	/**
	 * @bytes - byte array of the string to be encoded into base64 This method returns base 64 encoded value of the
	 *        given byte array
	 * @param bytes
	 * @return String
	 */
	public static String base64(byte[] bytes)
	{

		return Base64.encodeBase64String(bytes);
	}

	/**
	 * @str - string to be encoded into base64 This method returns base 64 encoded value of the given string
	 * 
	 * @param str
	 * @return byte[]
	 */
	public static byte[] base64(String str)
	{

		return Base64.decodeBase64(str);
	}

	/**
	 * * @bytes - byte array of the string to be encoded into hex dump This method returns hex encoded value of the
	 * given byte array
	 * 
	 * @param bytes
	 * @return String
	 */
	public static String hex(byte[] bytes)
	{

		return Hex.encodeHexString(bytes);
	}

	/**
	 * * @str - string to be encoded into hex dump This method returns hex encoded value of the given string
	 * 
	 * @param str
	 * @return byte[]
	 * @exception DecoderException
	 */
	public static byte[] hex(String str)
	{

		try
		{
			return Hex.decodeHex(str.toCharArray());
		} catch (DecoderException e)
		{
			throw new IllegalStateException(e);
		}
	}

	/**
	 * * @data - string to be converted into hex dump This method returns hex encoded value of the given string
	 * 
	 * @param data
	 * @return byte[]
	 */
	public static byte[] hexStringToByteArray(String data)
	{

		int k = 0;
		byte[] results = new byte[data.length() / 2];
		for (int i = 0; i < data.length();)
		{
			results[k] = (byte) (Character.digit(data.charAt(i++), 16) << 4);
			results[k] += (byte) (Character.digit(data.charAt(i++), 16));
			k++;
		}
		return results;
	}

	/**
	 * * @request - Http request object This method returns hex encoded value of the given string
	 * 
	 * @param data
	 * @throws NullDataException
	 */
	public static void checkNUll(String data) throws NullDataException
	{

		if (data == null || data == "" || data.equals(""))
		{

			throw new NullDataException(ErrorEnum.NULL_DATA.getErrorCode(), "Data is NULL");
		}
	}

	/**
	 * create the error mesage to be returned
	 * 
	 * @param errorEnum
	 * @param ex
	 * @return String
	 */
	public static String constructError(ErrorEnum errorEnum, Exception ex, String data)
	{

		StringBuilder sb = new StringBuilder();
		sb.append("{\"status\":\"Failure\",\"statuscode\":\"");
		sb.append(errorEnum);
		sb.append("\",\"message\":\"");
		sb.append(ex.getMessage());
		sb.append("\",\"data\":");
		sb.append(data); // data should be in json structure
		sb.append("}");

		return sb.toString();
	}

	/**
	 * used to validate the data for check null and check size
	 * 
	 * @param paramValue
	 * @throws NullDataException
	 * @throws InvalidSizeException
	 */
	public static void validateEncryptedData(String paramValue) throws NullDataException, InvalidSizeException
	{
		checkNUll(paramValue);
		checkSize(paramValue);

	}

	/**
	 * validate the size of param value to be greater than 5000000
	 * 
	 * @param paramValue
	 * @throws InvalidSizeException
	 */
	public static void checkSize(String paramValue) throws InvalidSizeException
	{

		if (paramValue.length() > 5000000)
		{
			throw new InvalidSizeException();
		}
	}

	/**
	 * validate the data
	 * 
	 * @param data
	 * @throws InvalidPrivateKeyException
	 */
	public static void validateDecryptedData(String data) throws InvalidPrivateKeyException
	{
		if (data.indexOf("encrypted=true") < 0)
		{
			LOGGER.ctdebug("CTRND00420", data);
			throw new InvalidPrivateKeyException();
		}
	}

	/**
	 * creating new instance of the public key implementation, Instaniating the container with the public key class and
	 * decrypting the secret key with the publi key container
	 * 
	 * @param publicKeyClass
	 * @param decodedBytes
	 * @return String
	 * @throws InvalidImplementationException
	 * @throws UnAuthorisedException
	 */
	public static String decryptWithPublicKey(String publicKeyClass, byte[] decodedBytes, HttpServletRequest request)
			throws InvalidImplementationException, UnAuthorisedException
	{
		String aesKey = null;
		try
		{
			PublicKeyInterface pubKeyClass = (PublicKeyInterface) Class.forName(publicKeyClass).newInstance(); // creating
																												// new
																												// instance
																												// of
																												// the
																												// public
																												// key
																												// implementation
			PublicKeyContainer pubKeyCont = new PublicKeyContainer(request, pubKeyClass); // Instaniating the container
																							// with the public key class
			aesKey = pubKeyCont.decrypt(decodedBytes); // decrypting the secret key with the publi key container

		} catch (InstantiationException e)
		{
			throw new InvalidImplementationException();
		} catch (IllegalAccessException e)
		{
			throw new UnAuthorisedException();
		} catch (ClassNotFoundException e)
		{
			throw new InvalidImplementationException();
		}
		return aesKey;
	}

	/**
	 * creating new instance of the secret key class, Instaniating container class with the secret key class and
	 * encrypting the secret key with the secret key as the pay load.
	 * 
	 * @return String
	 * @throws InvalidImplementationException
	 * @throws UnAuthorisedException
	 * @throws EncryptionException
	 * @throws UnSupportedAlgorithmException
	 * @throws UnSupportedProviderException
	 * @throws InvalidSizeException
	 */
	public static String encryptWithSecretKey(String encryptionKeyClass, String data, HttpServletRequest request)
			throws InvalidImplementationException, UnAuthorisedException, EncryptionException, UnSupportedAlgorithmException,
			UnSupportedProviderException, InvalidSizeException
	{
		String cipherText64 = null;
		try
		{
			EncryptionEngine aesEngine = (EncryptionEngine) Class.forName(encryptionKeyClass).newInstance(); // creating
																												// new
																												// instance
																												// of
																												// the
																												// secret
																												// key
																												// class
			EncryptionContainer encCont = new EncryptionContainer(request, aesEngine); // Instaniating container class
																						// with the secret key class
			byte[] cipherText = encCont.encrypt(data); // encrypting the secret key with the secret key as the pay load

			cipherText64 = new String(Base64.encodeBase64(cipherText)); // base 64 encoding the encoded string , this
																		// has to be done to avoid data loss

		} catch (InvalidKeyException e)
		{
			throw new EncryptionException();
		} catch (NoSuchAlgorithmException e)
		{
			throw new UnSupportedAlgorithmException();
		} catch (NoSuchProviderException e)
		{
			throw new UnSupportedProviderException();
		} catch (NoSuchPaddingException e)
		{
			throw new UnSupportedAlgorithmException();
		} catch (InvalidAlgorithmParameterException e)
		{
			throw new UnSupportedAlgorithmException();
		} catch (IllegalBlockSizeException e)
		{
			throw new InvalidSizeException();
		} catch (BadPaddingException e)
		{
			throw new UnSupportedAlgorithmException();
		} catch (InstantiationException e)
		{
			throw new InvalidImplementationException();
		} catch (IllegalAccessException e)
		{
			throw new UnAuthorisedException();
		} catch (ClassNotFoundException e)
		{
			throw new InvalidImplementationException();
		}
		return cipherText64;

	}

	/**
	 * creating new instance of secret key class and Instaniating container class with the secret key class
	 * 
	 * @return boolean
	 * @throws UnSupportedAlgorithmException
	 * @throws InvalidImplementationException
	 * @throws UnAuthorisedException
	 * @throws DecryptionException
	 */
	public static boolean storeSecretKey(String encryptionKeyClass, String secretKey, HttpServletRequest request)
			throws UnSupportedAlgorithmException, InvalidImplementationException, UnAuthorisedException, DecryptionException
	{
		try
		{
			EncryptionEngine aesEngine = (EncryptionEngine) Class.forName(encryptionKeyClass).newInstance(); // creating
																												// new
																												// instance
																												// of
																												// the
																												// secret
																												// key
																												// class
			EncryptionContainer encCont = new EncryptionContainer(request, aesEngine); // Instaniating container class
																						// with the secret key class
			encCont.storeKey(secretKey); // we need this for storing key in the session
		} catch (UnsupportedEncodingException e)
		{
			throw new UnSupportedAlgorithmException();
		} catch (InstantiationException e)
		{
			throw new InvalidImplementationException();
		} catch (IllegalAccessException e)
		{
			throw new UnAuthorisedException();
		} catch (ClassNotFoundException e)
		{
			throw new InvalidImplementationException();
		} catch (DecoderException e)
		{
			throw new DecryptionException();
		}

		return Boolean.TRUE;
	}

	/**
	 * instaniate the implementation class ,instaniate the container class with the implementation and call the decrypt
	 * method on the parameter data
	 * 
	 * @param encryptionKeyClass
	 * @param paramValue
	 * @param request
	 * @return String
	 * @throws InvalidPrivateKeyException
	 * @throws UnSupportedAlgorithmException
	 * @throws UnSupportedProviderException
	 * @throws InvalidSizeException
	 * @throws InvalidImplementationException
	 * @throws UnAuthorisedException
	 */
	public static String decryptWithSecretKey(String encryptionKeyClass, String paramValue, ServletRequest request)
			throws InvalidPrivateKeyException, UnSupportedAlgorithmException, UnSupportedProviderException, InvalidSizeException,
			InvalidImplementationException, UnAuthorisedException
	{
		String data = null;
		try
		{
			EncryptionEngine aesEngine = (EncryptionEngine) Class.forName(encryptionKeyClass).newInstance(); // instaniate
																												// the
																												// implementation
																												// class
			EncryptionContainer encCont = new EncryptionContainer((HttpServletRequest) request, aesEngine);// instaniate
																											// the
																											// container
																											// class
																											// with the
																											// implementation
																											// instance
			data = encCont.decrypt(EncryptionUtils.hexStringToByteArray(paramValue));// call the decrypt method on the
																						// parameter data
		} catch (InvalidKeyException e)
		{
			throw new InvalidPrivateKeyException();
		} catch (NoSuchAlgorithmException e)
		{
			throw new UnSupportedAlgorithmException();
		} catch (NoSuchProviderException e)
		{
			throw new UnSupportedProviderException();
		} catch (NoSuchPaddingException e)
		{
			throw new UnSupportedAlgorithmException();
		} catch (InvalidAlgorithmParameterException e)
		{
			throw new UnSupportedAlgorithmException();
		} catch (IllegalBlockSizeException e)
		{
			throw new InvalidSizeException();
		} catch (BadPaddingException e)
		{
			throw new UnSupportedAlgorithmException();
		} catch (InstantiationException e)
		{
			throw new InvalidImplementationException();
		} catch (IllegalAccessException e)
		{
			throw new UnAuthorisedException();
		} catch (ClassNotFoundException e)
		{
			throw new InvalidImplementationException();
		}
		return data;
	}

	/**
	 * to create the Json string
	 * 
	 * @param key
	 * @param value
	 * @return String
	 */
	public static String createJson(String key, String value)
	{

		StringBuilder sb = new StringBuilder();
		sb.append("{\"");
		sb.append(key);
		sb.append("\":\"");
		sb.append(value);
		sb.append("\"}");

		return sb.toString();
	}

	private static final Logger LOGGER = Logger.getLogger(EncryptionUtils.class);

}
