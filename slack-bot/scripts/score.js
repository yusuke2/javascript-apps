// Description:
//   Hubotのhelpコマンドを生成
//
// Commands:
//   hubot <user> ++ - ユーザのスコアをインクリメント
//   hubot <user> -- - ユーザのスコアをデクリメント
//   hubot score     - スコアのランキングを表示

var table = require('easy-table');

module.exports = function(robot) {
  var NIL_MSG = '結果はありません。';

  robot.hear(/set\s*(\d[:]\d\d)$/i, function(msg) {
    var time = msg.match[1].trim();

    // msg.send(" 目覚ましを " + time + " にセットしました ");
    msg.send(" 目覚ましを " + time + " にセットしました ");
  });

  robot.hear(/(.+)\s*--$/i, function(msg) {
    var user = msg.match[1].trim();
    var scores = getScores();
    var score = (scores[user] != null ? scores[user] : 0) - 1;

    score = score < 0 ? 0 : score;
    setScore(user, score);
    msg.send(user + " さんのスコアが " + score + " になりました!");
  });

  robot.respond(/score$/i, function(msg) {
    var scores = getScores();
    var results = [];
    var t = new table;

    for (user in scores) {
      results.push({
        user: user,
        score: scores[user]
      });
    }

    results.sort(function(a, b) {
      if (a.score > b.score) { return -1; }
      if (a.score < b.score) { return 1; }
      return 0;
    });

    results.forEach(function(result, _) {
      t.cell('User', result.user);
      t.cell('Score', result.score);
      t.newRow();
    });

    if (t.rows.length > 0) {
      return msg.reply("```\n" + (t.print().trim()) + "\n```");
    }

    msg.reply(NIL_MSG);
  });

  var getScores = function() {
    var scores = robot.brain.get('scores')

    return scores != null ? scores : {};
  };

  var setScore = function(user, score) {
    var scores = getScores();

    scores[user] = score;
    robot.brain.set('scores', scores);
  };
};
