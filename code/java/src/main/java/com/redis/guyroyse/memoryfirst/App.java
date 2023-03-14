package com.redis.guyroyse.memoryfirst;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import redis.clients.jedis.JedisPooled;

public class App
{
  private static final List<String> values = Arrays.asList("alfa", "bravo", "charlie");

  private static final List<byte[]> binaryValues = Arrays.asList(
    new byte[] { 1, 2, 3 },
    new byte[] { 4, 5, 6 },
    new byte[] { 7, 8, 9 }
  );

  private static JedisPooled jedis;

  public static void main( String[] args ) throws IOException
  {

    // #region Connect to Redis
    jedis = new JedisPooled("localhost", 6379);
    // #endregion

    // #region LPUSH some values
    values.stream().forEach(s -> jedis.lpush("some:list", s));
    log("LPUSH some:list %s", listToString(values));
    waitForEnter();
    // #endregion

    // #region LINDEX the middle values
    String value = jedis.lindex("some:list", 1);
    log("LINDEX some:list 1 returned => %s", value);
    waitForEnter();
    // #endregion

    // #region LRANGE to get all the values
    List<String> strings = jedis.lrange("some:list", 0, -1);
    log("LRANGE some:list 0 -1 returned => %s", listToString(strings));
    waitForEnter();
    // #endregion

    // #region RPOP those values
    IntStream.range(0, 3).forEach(i -> {
      String popped = jedis.rpop("some:list");
      log("RPOP some:list returned => %s", popped);
    });
    waitForEnter();
    // #endregion

    // #region LPUSH some binary data
    binaryValues.stream().forEach(bytes -> jedis.lpush("binary:list".getBytes(), bytes));
    log("LPUSH binary:list %s", listOfBytesToString(binaryValues));
    waitForEnter();
    // #endregion

    // #region RPOP those values
    IntStream.range(0, 3).forEach(i -> {
      byte[] bytes = jedis.rpop("binary:list".getBytes());
      log("RPOP binary:list returned => %s", bytesToString(bytes));
    });
    waitForEnter();
    // #endregion

    // #region Close out of Redis
    jedis.close();
    // #endregion
  }

  private static void waitForEnter() throws IOException {
    System.out.println("...press the enter key...");
    System.in.read();
  }

  private static void log(String s, Object ...args) {
    String message = String.format(s, args);
    System.out.println(message);
  }

  private static String listToString(List<String> list) {
    String strings = list.stream()
      .collect(Collectors.joining(" "));
    return String.format("[%s]", strings);
  }

  private static String listOfBytesToString(List<byte[]> list) {
    return list.stream()
      .map(App::bytesToString)
      .collect(Collectors.joining(" "));
  }

  private static String bytesToString(byte[] bytes) {
    String byteString = IntStream.range(0, bytes.length)
      .map(i -> bytes[i])
      .mapToObj(String::valueOf)
      .collect(Collectors.joining(" "));
    return String.format("[%s]", byteString);
  }
}
