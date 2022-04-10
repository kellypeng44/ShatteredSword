export enum Player_Events {
    PLAYER_MOVE = "PlayerMove",
    PLAYER_JUMP = "PlayerJump",
    PLAYER_ATTACK = "PlayerAttack",
    PLAYER_DASH = "PlayerDash",
    PLAYER_HEAL = "PlayerHeal",
    LEVEL_START = "LevelStart",
    LEVEL_END = "LevelEnd",
    PLAYER_KILLED = "PlayerKilled",
    ENEMY_KILLED = "EnemyKilled",
    PLAYER_HIT_ENEMY = "PlayerHitEnemy",
    BOSS_KILLED = "BossKilled",
}
export enum Damage_Type {
    NORMAL_DAMAGE = "NormalDamage",
    ENVIRONMENT_DAMAGE = "EnvironmentDamage",
    DOT_DAMAGE = "DOTDamage",
}

export enum Statuses {
    IN_RANGE = "IN_RANGE",
    LOW_HEALTH = "LOW_HEALTH",
    CAN_RETREAT = "CAN_RETREAT",
    REACHED_GOAL = "GOAL"
}