/**
 * Represents a Github user, the owner of a repository.
 */
type Owner = {
  /**
   * The owner Github username.
   */
  name: string;
  /**
   * The owner Github account avatar URL.
   */
  avatarURL: string | null;
};

export default Owner;
