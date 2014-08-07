
exports.up = (knex, Promise) ->
  knex.schema.createTable 'users', (table)->
    table.increments 'id'
    table.string('fb_id').unique()
    table.date 'date'
    table.string 'source'
    table.string 'solar_company'
    table.json 'privacy_settings'
    table.timestamps()


exports.down = (knex, Promise) ->
  knex.schema.dropTable 'users'
