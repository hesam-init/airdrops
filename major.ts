const token = Deno.env.get("MAJOR_TOKEN"); // put your token here

async function delay(ms: number) {
  return new Promise((reslove) => setTimeout(() => reslove(true), ms));
}

async function validateToken(token: string) {
  const headers = { Authorization: token };

  const res = await fetch(`https://major.bot/api/users/6946511911/`, {
    headers,
  });

  if (res.status !== 200) {
    console.log("Error: Token is invalid !!!");
    throw "";
  }
}

async function setStreak(token: string) {
  const headers = { Authorization: token };

  const res = await fetch("https://major.bot/api/user-visits/streak/", {
    headers,
  });
  const data = await res.json();

  if (data.user_id) {
    return data.streak;
  } else {
    throw "Error: Cannot set streak";
  }
}

async function getTasks(token: string) {
  const headers = { Authorization: token };

  let tasks = [];
  const res = await fetch("https://major.bot/api/tasks/?is_daily=false", {
    headers,
  });

  tasks.push(...(await res.json()));

  const res2 = await fetch("https://major.bot/api/tasks/?is_daily=true", {
    headers,
  });

  tasks.push(
    ...(await res2.json()).filter(
      (v: any) => !tasks.some((value) => v.id === value.id),
    ),
  );

  return tasks;
}

async function doneTask(token: string, id: number) {
  const headers = { Authorization: token };

  const res = await fetch("https://major.bot/api/tasks/", {
    headers,
    method: "POST",
    body: JSON.stringify({
      task_id: id,
    }),
  });

  const data = await res.json();

  return data.is_completed ?? false;
}

async function rouletteGame(token: string) {
  const headers = { Authorization: token };
  const res = await fetch("https://major.bot/api/roulette/", {
    method: "POST",
    headers,
  });

  const data = await res.json();

  return data.rating_award;
}

async function holdGame(token: string) {
  const headers = { Authorization: token };

  const res = await fetch("https://major.bot/api/bonuses/coins/", {
    headers,
    method: "POST",
    body: JSON.stringify({
      coins: 901,
    }),
  });

  const data = await res.json();

  if (data.success == true) {
    return 901;
  }
}

async function swipeGame(token: string) {
  const headers = { Authorization: token };

  const res = await fetch("https://major.bot/api/swipe_coin/", {
    method: "POST",
    headers,
    body: JSON.stringify({
      coins: 2900,
    }),
  });

  const data = await res.json();

  if (data.success == true) {
    return 2900;
  }
}

async function makeMoney() {
  console.log("Success: Let's start...");

  await validateToken(token);

  console.log("Success: token is correct...");

  const streak = await setStreak(token);

  console.log(`Success: Update streak ${streak}`);

  const holdReward = await holdGame(token);

  holdReward &&
    console.log(`Success: Checked hold game, your reward: ${holdReward}`);

  const rouletteReward = await rouletteGame(token);

  rouletteReward &&
    console.log(
      `Success: Checked roulette game, your reward: ${rouletteReward}`,
    );

  const swipeReward = await swipeGame(token);

  swipeReward &&
    console.log(`Success: Checked swipe game, your reward: ${swipeReward}`);

  const tasks = await getTasks(token);

  console.log(
    `Success: Fetched all of your tasks, Checking your tasks...Wait!`,
  );

  for (let i = 0; i < tasks.length; i++) {
    await delay(1000);
    const done = await doneTask(token, tasks[i].id);
    if (done) {
      console.log(
        `Success: Completed ${tasks[i].id} task, your reward: ${
          tasks[i].award
        }`,
      );
    }
  }

  console.log(`Success: Checked ${tasks.length} Tasks`);

  console.log("Success: It's done, good luck!");
}

makeMoney();
