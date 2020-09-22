SCRIPT_DIR=${REMOTE_SEED_DIR:-$(cd $(dirname $0); pwd)}

mongoimport --db colorschemes --collection repositories --jsonArray --drop --file ${SCRIPT_DIR}/data.json
