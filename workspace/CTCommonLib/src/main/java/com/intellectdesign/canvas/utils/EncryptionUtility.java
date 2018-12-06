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
package com.intellectdesign.canvas.utils;

import java.security.MessageDigest;
import java.util.Arrays;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;

import com.intellectdesign.canvas.exceptions.common.BaseException;

/**
 * Utility class for facilitating encryption and decryption
 */
public class EncryptionUtility
{
	public enum Algorithm
	{
		/**
		 * The AES Algorithm
		 */
		AES("AES", 16),
		/**
		 * The DES Algorithm
		 */
		DES("DES", 16),
		/**
		 * The Triple DES Algorithm
		 */
		TRIPLEDES("DESede", 24);

		private String encryptionAlgorithm;
		private int keySize;

		private Algorithm(String cryptoAlgo, int size)
		{
			encryptionAlgorithm = cryptoAlgo;
			keySize = size;
		}

		/**
		 * This method is to be invoked on the enum constant to perform the encryption based on the corresponding
		 * algorithm
		 * 
		 * @param plainText The text to be encrypted
		 * @param secretKey The secret key to be used
		 * @return The encrypted text for the source provided
		 * @throws BaseException Thrown if any error occurs during encryption
		 */
		public String encrypt(String plainText, String secretKey) throws BaseException
		{
			try
			{
				byte[] encryptedTextAsBytes = transform(Cipher.ENCRYPT_MODE, getKeyBytes(secretKey),
						plainText.getBytes("UTF-8"));

				return Base64.encodeBase64String(encryptedTextAsBytes);
			} catch (Exception e)
			{
				throw new BaseException(e);
			}
		}

		/**
		 * This method is to be invoked on the enum constant to perform the decryption based on the corresponding
		 * algorithm
		 * 
		 * @param encryptedText The text to be decrypted
		 * @param secretKey The secret key to be used
		 * @return The plain text for the source provided
		 * @throws BaseException Thrown if any error occurs during decryption
		 */
		public String decrypt(String encryptedText, String secretKey) throws BaseException
		{
			try
			{
				byte[] plainTextAsBytes = transform(Cipher.DECRYPT_MODE, getKeyBytes(secretKey),
						Base64.decodeBase64(encryptedText));
				return new String(plainTextAsBytes, "UTF-8");
			} catch (Exception e)
			{
				throw new BaseException(e);
			}
		}

		/**
		 * Helper method that does the 2 way translation needed for AES
		 * 
		 * @param mode one of Cipher.ENCRYPT_MODE or Cipher.DECRYPT_MODE
		 * @param keyBytes The byte array corresponding to the key
		 * @param msgBytes The byte array corresponding to the message
		 * @return The byte[] corresponding to the encrypted / decrypted state of the message
		 * @throws Exception Thrown if any error occurs while transformation
		 */
		private byte[] transform(int mode, byte[] keyBytes, byte[] msgBytes) throws Exception
		{
			final SecretKeySpec keySpec = new SecretKeySpec(keyBytes, encryptionAlgorithm);
			final Cipher cipher = Cipher.getInstance(encryptionAlgorithm);
			cipher.init(mode, keySpec);
			return cipher.doFinal(msgBytes);
		}

		/**
		 * Helper method that converts the secretkey to bytes after ensuring that the right key size is respected
		 * 
		 * @param secretKey
		 * @return
		 * @throws BaseException
		 */
		private byte[] getKeyBytes(String secretKey) throws BaseException
		{
			try
			{
				MessageDigest md = MessageDigest.getInstance("SHA-1");
				byte[] digestOfPassword = md.digest(secretKey.getBytes("utf-8"));
				byte[] keyBytes = Arrays.copyOf(digestOfPassword, keySize);
				return keyBytes;
			} catch (Exception e)
			{
				throw new BaseException(e);
			}
		}
	}

	/**
	 * This is a utility method that will retrieve the Algorithm implementation for the given Algorithm
	 * 
	 * @param algo The algorithm provided
	 * @return The Algorithm wrapper implemented for the provided algorithm
	 * @throws BaseException Thrown if the parameter provided is not a valid algorithm supported by Canvas
	 */
	public static Algorithm getAlgorithmFor(String algo) throws BaseException
	{
		try
		{
			return Algorithm.valueOf(algo);
		} catch (IllegalArgumentException e)
		{
			throw new BaseException("INV_ALGO", "The parameter provided '" + algo
					+ "' is not a valid algorithm supported by Canvas", e);
		}
	}

	public static void main(String[] args)
	{
		String connId = "My Local Oracle Instance1";
		String text = "{TRIPLEDES:XTfuEaUszBM=}";

		String tokens[];
		String plainText = text;
		tokens = StringUtils.split(text, ":");
		// Ensure that the first token (which will have the encryption algo) is present and the number of tokens is 2.
		// The text is expected in the pattern - {ALGO:EncryptedText}
		if (!StringUtils.isEmpty(tokens[0]) && tokens.length > 1)
		{
			// tokens[0].substring(1) will give the EncryptionAlgorithm
			String algorithmName = tokens[0].substring(1);
			try
			{
				EncryptionUtility.Algorithm algo = EncryptionUtility.getAlgorithmFor(algorithmName);
				plainText = algo.decrypt(tokens[1].substring(0, tokens[1].length() - 1), connId);
			} catch (BaseException e)
			{
				// Means error while doing decryption. In this scenario, take the value to be of plain text itself and
				// log the error.
				// LOGGER.cterror("CTDBL00219", e, algorithmName);
				System.err.println(e);
				e.printStackTrace();
			}
		}
		System.out.print(plainText);
	}
}
